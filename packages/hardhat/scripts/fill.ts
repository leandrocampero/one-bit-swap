import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import dotenv from 'dotenv'
import { writeFileSync } from 'fs'
import { ethers } from 'hardhat'
import prettier from 'prettier'
import {
  ERC20Mock,
  ERC20Mock__factory,
  Plataforma,
  Plataforma__factory,
} from '../typechain-types/'
import {
  formatArrayOrdenes,
  formatArrayTokens,
  showConsoleTable,
} from '../utils/helpers'

dotenv.config()

const { OWNER_PRIVATE_KEY } = process.env

/*******************************************************************************

 ######   #######  ##    ##  ######  ########    ###    ##    ## ########  ######
##    ## ##     ## ###   ## ##    ##    ##      ## ##   ###   ##    ##    ##    ##
##       ##     ## ####  ## ##          ##     ##   ##  ####  ##    ##    ##
##       ##     ## ## ## ##  ######     ##    ##     ## ## ## ##    ##     ######
##       ##     ## ##  ####       ##    ##    ######### ##  ####    ##          ##
##    ## ##     ## ##   ### ##    ##    ##    ##     ## ##   ###    ##    ##    ##
 ######   #######  ##    ##  ######     ##    ##     ## ##    ##    ##     ######

*******************************************************************************/

interface IOrdenInput {
  tipo: number
  tokenCompra: string
  tokenVenta: string
  montoCompra: string
  montoVenta: string
  vendedorIndice: number
}

const CANTIDAD_ORDENES = 100

const ORACULOS = {
  TOKEN_USDT_ORACULO: '0x92C09849638959196E976289418e5973CC96d645',
  TOKEN_LINK_ORACULO: '0x12162c3E810393dEC01362aBf156D7ecf6159528',
  TOKEN_MATIC_ORACULO: '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada',
  TOKEN_WETH_ORACULO: '0x0715A7794a1dc8e42615F059dD6e406A6594651A',
  TOKEN_DAI_ORACULO: '0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046',
  TOKEN_SAND_ORACULO: '0x9dd18534b8f456557d11B9DDB14dA89b2e52e308',
}

const TOKENS = ['USDT', 'LINK', 'MATIC', 'WETH', 'DAI', 'SAND']

const MONTO_2 = '2.465'
const MONTO_1 = '5.2'
const MONTO_3 = '13'
const MONTO_4 = '16.9'
const MONTO_5 = '26.3'
const MONTO_6 = '30'
const MONTO_7 = '41.131'
const MONTO_8 = '47'
const MONTO_9 = '59.5'
const MONTO_10 = '61.26'
const MONTO_11 = '61.81'
const MONTO_12 = '78'
const MONTO_13 = '81'
const MONTO_14 = '87.85'
const MONTO_15 = '94.7'

const MONTOS = [
  MONTO_1,
  MONTO_2,
  MONTO_3,
  MONTO_4,
  MONTO_5,
  MONTO_6,
  MONTO_7,
  MONTO_8,
  MONTO_9,
  MONTO_10,
  MONTO_11,
  MONTO_12,
  MONTO_13,
  MONTO_14,
  MONTO_15,
]

/*******************************************************************************

########  ######## ########  ##        #######  ##    ##
##     ## ##       ##     ## ##       ##     ##  ##  ##
##     ## ##       ##     ## ##       ##     ##   ####
##     ## ######   ########  ##       ##     ##    ##
##     ## ##       ##        ##       ##     ##    ##
##     ## ##       ##        ##       ##     ##    ##
########  ######## ##        ########  #######     ##

*******************************************************************************/

async function main() {
  //**********************************************//
  //                 Estructuras                  //
  //**********************************************//
  const billeteras: SignerWithAddress[] = (await ethers.getSigners()).slice(10)
  const cantidadOrdenes = CANTIDAD_ORDENES
  const ordenes: IOrdenInput[] = []

  //**********************************************//
  //             Contratos de Tokens              //
  //**********************************************//
  const ERC20Factory = (await ethers.getContractFactory(
    'contracts/ERC20Mock.sol:ERC20Mock'
  )) as ERC20Mock__factory

  const tokens: {
    [key: string]: ERC20Mock
  } = {}

  for (const token of TOKENS) {
    const contract = (await ERC20Factory.deploy(
      `${token} Token Mock - OBS`,
      token,
      billeteras[0].address,
      ethers.utils.parseEther('1000000')
    )) as ERC20Mock

    await contract.deployed()

    console.log(`Contrato de ${token} desplegado en ${contract.address}`)

    tokens[token] = contract
  }

  //**********************************************//
  //           Contrato de Plataforma             //
  //**********************************************//

  const ownerSigner = new ethers.Wallet(OWNER_PRIVATE_KEY!, ethers.provider)

  const PlataformaFactory = (await ethers.getContractFactory(
    'contracts/Plataforma.sol:Plataforma'
  )) as Plataforma__factory

  const plataforma = (await PlataformaFactory.connect(ownerSigner).deploy(
    1
  )) as Plataforma

  await plataforma.deployed()
  console.log(`Contrato de plataforma desplegado en ${plataforma.address}`)

  console.log('Emitiendo tokens a billeteras...')
  console.log('Generando aprobaciones...')
  console.log('Guardando tokens en plataforma...')
  for (const token of TOKENS) {
    // Instanciar contrato
    const contrato = tokens[token]

    //**********************************************//
    //                Emitir tokens                 //
    //**********************************************//
    for (const billetera of billeteras) {
      // Mintear para la billetera
      await contrato.mint(billetera.address, ethers.utils.parseEther('1000000'))

      // Aprobar gastar desde el contrato de la plataforma
      await contrato
        .connect(billetera)
        .approve(plataforma.address, ethers.utils.parseEther('1000000'))
    }

    //**********************************************//
    //       Guardar tokens en la Plataforma        //
    //**********************************************//
    await plataforma.nuevoToken(
      tokens[token].address,
      ORACULOS[`TOKEN_${token}_ORACULO` as keyof typeof ORACULOS]
    )
  }

  //**********************************************//
  //             Creacion de Ordenes              //
  //**********************************************//
  console.log('Creando ordenes aleatorias...')
  for (let index = 0; index < cantidadOrdenes; index++) {
    const orden: IOrdenInput = {} as IOrdenInput

    // Tipo de orden
    orden.tipo = Math.floor(Math.random() * 2)

    // Tokens de intercambio
    orden.tokenVenta = TOKENS[Math.floor(Math.random() * TOKENS.length)]
    while (orden.tokenVenta == orden.tokenCompra || !orden.tokenCompra) {
      orden.tokenCompra = TOKENS[Math.floor(Math.random() * TOKENS.length)]
    }

    // Montos de intercambio
    orden.montoVenta = MONTOS[Math.floor(Math.random() * MONTOS.length)]
    orden.montoCompra =
      orden.tipo == 0 ? MONTOS[Math.floor(Math.random() * MONTOS.length)] : '0'

    // Vendedor (creador de la orden)
    orden.vendedorIndice = Math.floor(Math.random() * billeteras.length)

    // Guardar datos
    ordenes.push(orden)

    //**********************************************//
    //               Guardar ordenes                //
    //**********************************************//

    await plataforma
      .connect(billeteras[orden.vendedorIndice])
      .nuevaOrden(
        tokens[orden.tokenCompra].symbol(),
        tokens[orden.tokenVenta].symbol(),
        ethers.utils.parseEther(orden.montoCompra),
        ethers.utils.parseEther(orden.montoVenta),
        orden.tipo
      )
  }

  //**********************************************//
  //         Ejecutar ordenes aleatorias          //
  //**********************************************//
  console.log('Ejecutando ordenes aleatoriamente...')
  const listado = formatArrayOrdenes(
    await plataforma.listarOrdenesActivas(
      ethers.constants.HashZero,
      CANTIDAD_ORDENES
    )
  )

  for (const orden of listado) {
    // Probabilidad
    const prob = Math.floor(Math.random() * (CANTIDAD_ORDENES + 1 - 1) + 1)
    let comprador: SignerWithAddress

    if (prob > 80) {
      do {
        comprador = billeteras[Math.floor(Math.random() * billeteras.length)]
      } while (comprador.address == orden.vendedor)

      await plataforma.connect(comprador).ejecutarOrden(orden.idOrden)

      console.log(`Orden ${orden.idOrden} ejecutada por: ${comprador.address}`)

      const ordenEjecutada = await plataforma.buscarOrden(orden.idOrden)

      Object.assign(orden, ordenEjecutada)
    }
  }

  // agrega administradores
  await plataforma.hacerAdministrador(
    '0x11a226591dcaa88B8E026dEd511AaEa3b9bA25d2'
  ) // Leandro
  await plataforma.hacerAdministrador(
    '0x6b4830E71048A69E5a71b1FebF085610c7012EF3'
  ) // Stonks
  await plataforma.hacerAdministrador(
    '0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf744C'
  ) // Gsus

  // agrega suspendidos
  await plataforma.bloquearBilletera(
    '0x2C9Fe1b36714DFe5B2e0dba74c1fe9eA59796F3f'
  )

  //**********************************************//
  //             Mostrar por consola              //
  //**********************************************//
  showConsoleTable(listado)

  //**********************************************//
  //      Exportando direcciones para probar      //
  //**********************************************//
  const deploy = {
    platform: plataforma.address,
  }

  writeFileSync(
    './../nextjs/src/contracts/deploy.json',
    JSON.stringify(deploy),
    'utf-8'
  )

  const faucets = formatArrayTokens(await plataforma.listarTokens(true))

  const faucetsFormated = prettier.format(JSON.stringify(faucets), {
    parser: 'json',
  })

  writeFileSync(
    './../nextjs/src/contracts/tokens.json',
    faucetsFormated,
    'utf-8'
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
