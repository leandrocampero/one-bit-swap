import '@nomicfoundation/hardhat-chai-matchers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import {
  Datos,
  ERC20Mock,
  ERC20Mock__factory,
  Plataforma,
  Plataforma__factory,
} from '../../typechain-types/'

describe('Plataforma', function () {
  let propietario: SignerWithAddress
  let usuario: SignerWithAddress
  let plataforma: Plataforma
  let tokenVenta: ERC20Mock
  let tokenCompra: ERC20Mock

  before(async function () {
    ;[propietario, usuario] = await ethers.getSigners()

    const PlataformaFactory = (await ethers.getContractFactory(
      'contracts/Plataforma.sol:Plataforma'
    )) as Plataforma__factory
    plataforma = (await PlataformaFactory.deploy(5)) as Plataforma

    const ERC20Factory = (await ethers.getContractFactory(
      'contracts/ERC20Mock.sol:ERC20Mock'
    )) as ERC20Mock__factory

    tokenVenta = (await ERC20Factory.deploy(
      'USDT Token Mock',
      'USDT',
      propietario.address,
      ethers.utils.parseEther('10000')
    )) as ERC20Mock

    tokenCompra = (await ERC20Factory.deploy(
      'LINK Token Mock',
      'LINK',
      usuario.address,
      ethers.utils.parseEther('10000')
    )) as ERC20Mock

    console.table({
      propietario: propietario.address,
      usuario: usuario.address,
      tokenVenta: tokenVenta.address,
      tokenCompra: tokenCompra.address,
    })

    console.table({
      allowance: (
        await tokenVenta.allowance(usuario.address, plataforma.address)
      ).toString(),
      balanceOf: (await tokenVenta.balanceOf(propietario.address)).toString(),
      symbol: await tokenVenta.symbol(),
      decimals: await tokenVenta.decimals(),
      name: await tokenVenta.name(),
    })
  })

  describe('Tokens', function () {
    it('Agregar dos tokens', async function () {
      await expect(
        plataforma.nuevoToken(
          tokenVenta.address,
          '0x92C09849638959196E976289418e5973CC96d645',
          { gasLimit: 5000000 }
        )
      ).not.to.be.reverted

      await expect(
        plataforma.nuevoToken(
          tokenCompra.address,
          '0x12162c3E810393dEC01362aBf156D7ecf6159528',
          { gasLimit: 5000000 }
        )
      ).not.to.be.reverted

      // const recibo = await plataforma.listarTokens(true)
      // console.log(recibo)
    })

    it('Debería retornar la cotización', async function () {
      const recibo = await plataforma.consultarCotizacion('MATIC')

      expect(recibo.toNumber()).not.to.equal(0)
    })
  })

  describe('Ordenes', function () {
    it('Crear 4 ordenes', async function () {
      expect(
        await tokenVenta.approve(
          plataforma.address,
          ethers.utils.parseEther('10000')
        )
      ).not.to.be.reverted

      await expect(
        await plataforma.nuevaOrden(
          'LINK',
          'USDT',
          ethers.utils.parseEther('200'),
          ethers.utils.parseEther('15'),
          0
        )
      ).to.emit(plataforma, 'NuevaOrden')

      await expect(
        await plataforma.nuevaOrden(
          'LINK',
          'USDT',
          ethers.utils.parseEther('0'),
          ethers.utils.parseEther('200'),
          1
        )
      ).to.emit(plataforma, 'NuevaOrden')

      await expect(
        await plataforma.nuevaOrden(
          'LINK',
          'USDT',
          ethers.utils.parseEther('0'),
          ethers.utils.parseEther('200'),
          1
        )
      ).to.emit(plataforma, 'NuevaOrden')

      await expect(
        await plataforma.nuevaOrden(
          'LINK',
          'USDT',
          ethers.utils.parseEther('0'),
          ethers.utils.parseEther('200'),
          1
        )
      ).to.emit(plataforma, 'NuevaOrden')

      const archivo = await plataforma.ordenes()

      expect(archivo.cantidadActivas).to.equal(4)

      const ordenGemela = BigNumber.from(
        await plataforma.buscarOrdenGemela(
          'USDT',
          'LINK',
          ethers.utils.parseEther('200'),
          ethers.utils.parseEther('0')
        )
      )

      expect(ordenGemela.isZero()).not.to.be.true
    })

    it('Comprobar saldo de los tokens del contrato', async function () {
      const saldo = await tokenVenta.balanceOf(plataforma.address)

      expect(saldo.isZero()).not.to.be.true
    })

    it('Ejecutar orden', async function () {
      let ordenesActivas = (
        (await plataforma.listarOrdenesActivas(
          ethers.constants.HashZero,
          10
        )) as Datos.OrdenStruct[]
      ).map((orden) => ({
        idOrden: orden.idOrden,
        siguienteOrdenActiva: orden.siguienteOrdenActiva,
        anteriorOrdenActiva: orden.anteriorOrdenActiva,
        siguienteOrdenGemela: orden.siguienteOrdenGemela,
        anteriorOrdenGemela: orden.anteriorOrdenGemela,
        vendedor: orden.vendedor,
        comprador: orden.comprador,
        montoVenta: orden.montoVenta.toString(),
        montoCompra: orden.montoCompra.toString(),
        fechaCreacion: new Date(
          (orden.fechaCreacion as BigNumber).toNumber() * 1000
        ),
        fechaFinalizacion: new Date(
          (orden.fechaFinalizacion as BigNumber).toNumber() * 1000
        ),
        estado: orden.estado,
        tipo: orden.tipo,
        existe: orden.existe,
        tokenCompra: orden.tokenCompra,
        tokenVenta: orden.tokenVenta,
      }))

      expect(
        await tokenCompra
          .connect(usuario)
          .approve(plataforma.address, ethers.utils.parseEther('10000'))
      ).not.to.be.reverted

      const transaccion = await plataforma
        .connect(usuario)
        .ejecutarOrden(ordenesActivas[1].idOrden)

      transaccion.wait()

      const aux = (await plataforma.buscarOrden(
        ordenesActivas[1].idOrden
      )) as Datos.OrdenStruct
      const ordenEjecutada = {
        idOrden: aux.idOrden,
        siguienteOrdenActiva: aux.siguienteOrdenActiva,
        anteriorOrdenActiva: aux.anteriorOrdenActiva,
        siguienteOrdenGemela: aux.siguienteOrdenGemela,
        anteriorOrdenGemela: aux.anteriorOrdenGemela,
        vendedor: aux.vendedor,
        comprador: aux.comprador,
        montoVenta: aux.montoVenta.toString(),
        montoCompra: aux.montoCompra.toString(),
        fechaCreacion: new Date(
          (aux.fechaCreacion as BigNumber).toNumber() * 1000 -
            1000 * 3 * 60 * 60
        ),
        fechaFinalizacion: new Date(
          (aux.fechaFinalizacion as BigNumber).toNumber() * 1000 -
            1000 * 3 * 60 * 60
        ),
        estado: aux.estado,
        tipo: aux.tipo,
        existe: aux.existe,
        tokenCompra: aux.tokenCompra,
        tokenVenta: aux.tokenVenta,
      }

      const saldoVendedor = await tokenCompra.balanceOf(propietario.address)
      const saldoComprador = await tokenVenta.balanceOf(usuario.address)

      expect(saldoVendedor.eq(ordenEjecutada.montoCompra.toString())).to.be.true
      expect(saldoComprador.eq(ordenEjecutada.montoVenta.toString())).to.be.true

      ordenesActivas = (
        (await plataforma.listarOrdenesActivas(
          ethers.constants.HashZero,
          10
        )) as Datos.OrdenStruct[]
      ).map((orden) => ({
        idOrden: orden.idOrden,
        siguienteOrdenActiva: orden.siguienteOrdenActiva,
        anteriorOrdenActiva: orden.anteriorOrdenActiva,
        siguienteOrdenGemela: orden.siguienteOrdenGemela,
        anteriorOrdenGemela: orden.anteriorOrdenGemela,
        vendedor: orden.vendedor,
        comprador: orden.comprador,
        montoVenta: orden.montoVenta.toString(),
        montoCompra: orden.montoCompra.toString(),
        fechaCreacion: new Date(
          (orden.fechaCreacion as BigNumber).toNumber() * 1000
        ),
        fechaFinalizacion: new Date(
          (orden.fechaFinalizacion as BigNumber).toNumber() * 1000
        ),
        estado: orden.estado,
        tipo: orden.tipo,
        existe: orden.existe,
        tokenCompra: orden.tokenCompra,
        tokenVenta: orden.tokenVenta,
      }))
    })

    it('Cancelar orden', async function () {
      console.log(
        '****************** ORDENES ACTIVAS (PRE EJECUCIÓN) ******************'
      )

      let ordenesActivas = (
        (await plataforma.listarOrdenesActivas(
          ethers.constants.HashZero,
          10
        )) as Datos.OrdenStruct[]
      ).map((orden) => ({
        idOrden: orden.idOrden,
        siguienteOrdenActiva: orden.siguienteOrdenActiva,
        anteriorOrdenActiva: orden.anteriorOrdenActiva,
        siguienteOrdenGemela: orden.siguienteOrdenGemela,
        anteriorOrdenGemela: orden.anteriorOrdenGemela,
        vendedor: orden.vendedor,
        comprador: orden.comprador,
        montoVenta: orden.montoVenta.toString(),
        montoCompra: orden.montoCompra.toString(),
        fechaCreacion: new Date(
          (orden.fechaCreacion as BigNumber).toNumber() * 1000
        ),
        fechaFinalizacion: new Date(
          (orden.fechaFinalizacion as BigNumber).toNumber() * 1000
        ),
        estado: orden.estado,
        tipo: orden.tipo,
        existe: orden.existe,
        tokenCompra: orden.tokenCompra,
        tokenVenta: orden.tokenVenta,
      }))

      console.log(ordenesActivas)

      const transaccion = await plataforma.cancelarOrden(
        ordenesActivas[1].idOrden
      )

      transaccion.wait()

      const aux = (await plataforma.buscarOrden(
        ordenesActivas[1].idOrden
      )) as Datos.OrdenStruct
      const ordenCancelada = {
        idOrden: aux.idOrden,
        siguienteOrdenActiva: aux.siguienteOrdenActiva,
        anteriorOrdenActiva: aux.anteriorOrdenActiva,
        siguienteOrdenGemela: aux.siguienteOrdenGemela,
        anteriorOrdenGemela: aux.anteriorOrdenGemela,
        vendedor: aux.vendedor,
        comprador: aux.comprador,
        montoVenta: aux.montoVenta.toString(),
        montoCompra: aux.montoCompra.toString(),
        fechaCreacion: new Date(
          (aux.fechaCreacion as BigNumber).toNumber() * 1000 -
            1000 * 3 * 60 * 60
        ),
        fechaFinalizacion: new Date(
          (aux.fechaFinalizacion as BigNumber).toNumber() * 1000 -
            1000 * 3 * 60 * 60
        ),
        estado: aux.estado,
        tipo: aux.tipo,
        existe: aux.existe,
        tokenCompra: aux.tokenCompra,
        tokenVenta: aux.tokenVenta,
      }

      console.log('ORDEN CANCELADA:', ordenCancelada)
      console.log(
        '****************** ORDENES ACTIVAS (POST EJECUCIÓN) ******************'
      )

      expect(ordenCancelada.estado == 2).to.be.true

      ordenesActivas = (
        (await plataforma.listarOrdenesActivas(
          ethers.constants.HashZero,
          10
        )) as Datos.OrdenStruct[]
      ).map((orden) => ({
        idOrden: orden.idOrden,
        siguienteOrdenActiva: orden.siguienteOrdenActiva,
        anteriorOrdenActiva: orden.anteriorOrdenActiva,
        siguienteOrdenGemela: orden.siguienteOrdenGemela,
        anteriorOrdenGemela: orden.anteriorOrdenGemela,
        vendedor: orden.vendedor,
        comprador: orden.comprador,
        montoVenta: orden.montoVenta.toString(),
        montoCompra: orden.montoCompra.toString(),
        fechaCreacion: new Date(
          (orden.fechaCreacion as BigNumber).toNumber() * 1000
        ),
        fechaFinalizacion: new Date(
          (orden.fechaFinalizacion as BigNumber).toNumber() * 1000
        ),
        estado: orden.estado,
        tipo: orden.tipo,
        existe: orden.existe,
        tokenCompra: orden.tokenCompra,
        tokenVenta: orden.tokenVenta,
      }))

      console.log(ordenesActivas)

      const archivo = await plataforma.ordenes()

      expect(archivo.cantidadActivas).to.equal(2)

      console.log('****************** MIS ORDENES ******************')

      const misOrdenes = (
        (await plataforma.listarMisOrdenes()) as Datos.OrdenStruct[]
      ).map((orden) => ({
        idOrden: orden.idOrden,
        siguienteOrdenActiva: orden.siguienteOrdenActiva,
        anteriorOrdenActiva: orden.anteriorOrdenActiva,
        siguienteOrdenGemela: orden.siguienteOrdenGemela,
        anteriorOrdenGemela: orden.anteriorOrdenGemela,
        vendedor: orden.vendedor,
        comprador: orden.comprador,
        montoVenta: orden.montoVenta.toString(),
        montoCompra: orden.montoCompra.toString(),
        fechaCreacion: new Date(
          (orden.fechaCreacion as BigNumber).toNumber() * 1000
        ),
        fechaFinalizacion: new Date(
          (orden.fechaFinalizacion as BigNumber).toNumber() * 1000
        ),
        estado: orden.estado,
        tipo: orden.tipo,
        existe: orden.existe,
        tokenCompra: orden.tokenCompra,
        tokenVenta: orden.tokenVenta,
      }))
      console.log(misOrdenes)
    })
  })
})

/**
 * Nueva orden: Numero 1 - 0x82a940ca16d30332bb6b7c0087a5ac6f33a5b145978f9ef97160fd290e0f91bf
 * Nueva orden: Numero 2 - 0xfb2c787579f601a85ddc11b2ce1bd27057fa937270e3b7db51e2030b042576db
 * Nueva orden: Numero 3 - 0x135f0adc5eb7c18dea2bdc6bc002bd13bd4083ce12c8c101cb6c87e341a7e345
 * Nueva orden: Numero 4 - 0x63ac83890bda99ccfbe503bda8158ff0101a26116f7d19cfacc527073776b490
 * Orden Ejecutada: 0x135f0adc5eb7c18dea2bdc6bc002bd13bd4083ce12c8c101cb6c87e341a7e345
 */
