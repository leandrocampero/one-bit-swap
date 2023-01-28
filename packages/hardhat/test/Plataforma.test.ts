import '@nomicfoundation/hardhat-chai-matchers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import {
  ERC20Mock,
  ERC20Mock__factory,
  Plataforma,
  Plataforma__factory,
} from '../typechain-types/'

const ORACULO_USDT = '0x92C09849638959196E976289418e5973CC96d645'
const ORACULO_LINK = '0x12162c3E810393dEC01362aBf156D7ecf6159528'

const CONTRATO_MATIC = '0x0000000000000000000000000000000000001010'
const ORACULO_MATIC = '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada'

const CONTRATO_WETH = '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa'
const ORACULO_WETH = '0x0715A7794a1dc8e42615F059dD6e406A6594651A'

const CONTRATO_DAI = '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253'
const ORACULO_DAI = '0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046'

describe('OneBitSwap', function () {
  let propietario: SignerWithAddress,
    administrador: SignerWithAddress,
    usuario: SignerWithAddress,
    bloqueado: SignerWithAddress,
    comprador: SignerWithAddress,
    vendedor: SignerWithAddress

  let plataforma: Plataforma
  let tokenVenta: ERC20Mock, tokenCompra: ERC20Mock

  before(async function () {
    ;[propietario, administrador, usuario, bloqueado, comprador, vendedor] =
      await ethers.getSigners()

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
      vendedor.address,
      ethers.utils.parseEther('100000')
    )) as ERC20Mock

    tokenCompra = (await ERC20Factory.deploy(
      'LINK Token Mock',
      'LINK',
      comprador.address,
      ethers.utils.parseEther('100000')
    )) as ERC20Mock

    console.table({
      propietario: propietario.address,
      administrador: administrador.address,
      usuario: usuario.address,
      bloqueado: bloqueado.address,
      comprador: comprador.address,
      vendedor: vendedor.address,
      tokenVenta: tokenVenta.address,
      tokenCompra: tokenCompra.address,
    })
  })

  describe('Plataforma', function () {
    it('¿Está activa?', async function () {
      const estado = await plataforma.plataforma()

      expect(estado.estado == 0).to.be.true
    })

    it('Desactivar', async function () {
      await expect(plataforma.bloquearPlataforma()).not.to.be.reverted
    })

    it('No debería cambiar el monto mínimo a U$D 7', async function () {
      await expect(plataforma.establecerMontoMinimo(7)).to.be.revertedWith(
        'La plataforma se encuentra inactiva'
      )
    })

    it('Activar nuevamente', async function () {
      await expect(plataforma.desbloquearPlataforma()).not.to.be.reverted
    })

    it('Ahora podría cambiar el monto mínimo a U$D 8', async function () {
      await plataforma.establecerMontoMinimo(8)

      const estado = await plataforma.plataforma()

      expect(estado.montoMinimoUSD.eq(BigNumber.from(8))).to.be.true
    })
  })

  describe('Billeteras', function () {
    it('Agregar administrador', async function () {
      await expect(plataforma.hacerAdministrador(administrador.address)).not.to
        .be.reverted
    })

    it('Como administrador, no debería poder agregar a otro', async function () {
      await expect(
        plataforma.connect(administrador).hacerAdministrador(usuario.address)
      ).to.be.revertedWith('Solo el propietario puede acceder')
    })

    it('Como administrador podría cambiar el monto mínimo a U$D 5', async function () {
      await expect(plataforma.connect(administrador).establecerMontoMinimo(5))
        .not.to.be.reverted
    })

    it('Agregar otro administrador', async function () {
      await expect(plataforma.hacerAdministrador(usuario.address)).not.to.be
        .reverted
    })

    it('Debería haber 2 admistradores guardados', async function () {
      const administradores = await plataforma.listarAdministradores()

      expect(administradores.length).to.eq(2)
    })

    it('Quitar rol al último administrador agregado', async function () {
      const administradores = await plataforma.listarAdministradores()

      await expect(plataforma.quitarAdministrador(administradores[1].direccion))
        .not.to.be.reverted
    })

    it('Bloquear billetera genérica', async function () {
      await expect(plataforma.bloquearBilletera(usuario.address)).not.to.be
        .reverted
    })

    it('Debería haber solo una billetera bloqueada', async function () {
      const bloqueados = await plataforma.listarBilleterasBloqueadas()

      expect(bloqueados.length).to.eq(1)
    })

    it('Desbloquear billetera', async function () {
      await expect(plataforma.desbloquearBilletera(usuario.address)).not.to.be
        .reverted
    })
  })

  describe('Tokens', function () {
    it('Como usuario, no debería poder agregar tokens nuevos', async function () {
      await expect(
        plataforma.connect(usuario).nuevoToken(CONTRATO_DAI, ORACULO_DAI)
      ).to.be.revertedWith('Solo pueden acceder administradores')
    })

    it('Agregar 5 nuevos tokens', async function () {
      await expect(
        plataforma.nuevoToken(tokenVenta.address, ORACULO_USDT)
      ).to.emit(plataforma, 'NuevoToken')
      await expect(
        plataforma.nuevoToken(tokenCompra.address, ORACULO_LINK)
      ).to.emit(plataforma, 'NuevoToken')

      await expect(
        plataforma.nuevoToken(CONTRATO_MATIC, ORACULO_MATIC)
      ).to.emit(plataforma, 'NuevoToken')
      await expect(plataforma.nuevoToken(CONTRATO_WETH, CONTRATO_WETH)).to.emit(
        plataforma,
        'NuevoToken'
      )
      await expect(plataforma.nuevoToken(CONTRATO_DAI, ORACULO_DAI)).to.emit(
        plataforma,
        'NuevoToken'
      )

      const tokens = await plataforma.listarTokens(true)

      expect(tokens.length).to.eq(5)
    })

    it('Suspender el token con ticker DAI', async function () {
      await expect(plataforma.suspenderToken('DAI')).not.to.be.reverted
    })

    it('La cantidad de tokens activos debería ser 4', async function () {
      const tokens = await plataforma.listarTokens(false)

      expect(tokens.length).to.eq(4)
    })

    it('Modificar el oráculo de WETH por uno válido', async function () {
      await expect(plataforma.modifcarOraculo('WETH', ORACULO_WETH)).not.to.be
        .reverted
    })

    it('El mismo oráculo debería retronar una cotización en USD distinta de cero', async function () {
      const cotizacion = await plataforma.consultarCotizacion('WETH')

      expect(cotizacion.precio.gt(0)).to.be.true
    })

    it('Activar DAI', async function () {
      await expect(plataforma.activarToken('DAI')).not.to.be.reverted
    })
  })

  describe('Ordenes', function () {
    it('Crear 3 ordenes de compra-venta', async function () {
      await expect(
        tokenVenta
          .connect(vendedor)
          .approve(plataforma.address, ethers.utils.parseEther('100000'))
      ).to.emit(tokenVenta, 'Approval')

      // LINK/USDT
      await expect(
        plataforma
          .connect(vendedor)
          .nuevaOrden(
            tokenCompra.symbol(),
            tokenVenta.symbol(),
            ethers.utils.parseEther('300'),
            ethers.utils.parseEther('100'),
            0
          )
      ).to.emit(plataforma, 'NuevaOrden')

      // LINK/USDT
      await expect(
        plataforma
          .connect(vendedor)
          .nuevaOrden(
            tokenCompra.symbol(),
            tokenVenta.symbol(),
            ethers.utils.parseEther('456'),
            ethers.utils.parseEther('89'),
            0
          )
      ).to.emit(plataforma, 'NuevaOrden')

      // LINK/USDT
      await expect(
        plataforma
          .connect(vendedor)
          .nuevaOrden(
            tokenCompra.symbol(),
            tokenVenta.symbol(),
            ethers.utils.parseEther('840'),
            ethers.utils.parseEther('125'),
            0
          )
      ).to.emit(plataforma, 'NuevaOrden')
    })

    it('Crear 2 ordenes de intercambio idénticas (gemelas)', async function () {
      await expect(
        plataforma
          .connect(vendedor)
          .nuevaOrden(
            tokenCompra.symbol(),
            tokenVenta.symbol(),
            ethers.utils.parseEther('0'),
            ethers.utils.parseEther('1200'),
            1
          )
      ).to.emit(plataforma, 'NuevaOrden')

      await expect(
        plataforma
          .connect(vendedor)
          .nuevaOrden(
            tokenCompra.symbol(),
            tokenVenta.symbol(),
            ethers.utils.parseEther('0'),
            ethers.utils.parseEther('1200'),
            1
          )
      ).to.emit(plataforma, 'NuevaOrden')
    })

    it('Antes de crear una cuarta orden de compra-venta, verificar si ya existe una espejo', async function () {
      const gemela = await plataforma.buscarOrdenGemela(
        tokenVenta.symbol(),
        tokenCompra.symbol(),
        ethers.utils.parseEther('1200'),
        ethers.utils.parseEther('0')
      )

      expect(gemela.existe).to.be.true
    })

    it('El total de órdenes activas debería ser 5', async function () {
      const ordenes = await plataforma.listarOrdenesActivas(
        ethers.constants.HashZero,
        5
      )

      expect(ordenes.length).to.eq(5)
    })

    it('Ejecutar una orden de intercambio y comprobar la transferencia de fondos', async function () {
      await expect(
        tokenCompra
          .connect(comprador)
          .approve(plataforma.address, ethers.utils.parseEther('100000'))
      ).to.emit(tokenCompra, 'Approval')

      const ordenEjecutada = await plataforma.buscarOrdenGemela(
        tokenVenta.symbol(),
        tokenCompra.symbol(),
        ethers.utils.parseEther('1200'),
        ethers.utils.parseEther('0')
      )

      await expect(
        plataforma.connect(comprador).ejecutarOrden(ordenEjecutada.idOrden)
      ).not.to.be.reverted

      const saldoVendedor = await tokenCompra.balanceOf(vendedor.address)
      const saldoComprador = await tokenVenta.balanceOf(comprador.address)

      expect(saldoVendedor.gt(ordenEjecutada.montoCompra)).to.be.true
      expect(saldoComprador.eq(ordenEjecutada.montoVenta)).to.be.true
    })

    it('Cancelar una orden de compra-venta y comprobar la devolución de fondos', async function () {
      const ordenCancelada = await plataforma.buscarOrdenGemela(
        tokenVenta.symbol(),
        tokenCompra.symbol(),
        ethers.utils.parseEther('100'),
        ethers.utils.parseEther('300')
      )

      const saldoPrevio = await tokenVenta.balanceOf(vendedor.address)

      await expect(
        plataforma.connect(vendedor).cancelarOrden(ordenCancelada.idOrden)
      ).not.to.be.reverted

      const saldoResultante = await tokenVenta.balanceOf(vendedor.address)

      expect(saldoPrevio.add(ordenCancelada.montoVenta).eq(saldoResultante)).to
        .be.true
    })

    it('Ahora el total de ordenes activas debería ser 3', async function () {
      const ordenes = await plataforma.listarOrdenesActivas(
        ethers.constants.HashZero,
        5
      )

      expect(ordenes.length).to.eq(3)
    })

    it('Listar mis ordenes ordenadas historicamente', async function () {
      let ordenes = await plataforma.listarMisOrdenes()
      expect(ordenes.length).to.eq(0)

      ordenes = await plataforma.connect(vendedor).listarMisOrdenes()
      expect(ordenes.length).to.eq(5)
    })
  })
})
