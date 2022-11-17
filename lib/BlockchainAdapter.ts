import Plataforma from '@artifacts/Plataforma.sol/Plataforma.json'
import { Mensajes } from '@lib/constants/error'
import Billeteras from '@models/Billeteras'
import { Datos } from '@typechain/contracts/GestorTokens'
import { Plataforma as PlataformaInterface } from '@typechain/contracts/Plataforma'
import { ethers } from 'ethers'
import { listaTodasOrdenes, listaTokens } from '../scripts/modelos'
import Tokens from './models/Tokens'
import { Estados, EstadosOrdenes, TiposOrdenes } from './types.d'
export default class BlockchainAdapter {
  private static _gestor: BlockchainAdapter
  private _provider: ethers.providers.Web3Provider | null
  private _signer: ethers.providers.JsonRpcSigner | null
  private _contract: ethers.Contract | null

  private constructor() {
    this._provider = null
    this._signer = null
    this._contract = null
  }

  public static instanciar(): BlockchainAdapter {
    if (!this._gestor) {
      BlockchainAdapter._gestor = new BlockchainAdapter()
    }

    return BlockchainAdapter._gestor
  }

  /**
   * @function iniciar inicia los elementos de ethers necesarios para interactuar con el contrato
   * @returns {Error | null} devuelve error si no se pudo iniciar y nulo si todo está en orden
   */
  public async iniciar(): Promise<Error | null> {
    if (!window.ethereum) {
      return new Error(Mensajes.NO_METAMASK)
    }

    try {
      if (!this._provider) {
        this._provider = new ethers.providers.Web3Provider(
          window.ethereum,
          'any'
        )
      }

      this._signer = await this._provider.getSigner()
      this._contract = new ethers.Contract(
        '0xA3e6Fbe2707A7217Be8B4876979E77754FE88259',
        Plataforma.abi,
        this._signer
      ) as PlataformaInterface

      return null
    } catch (error: any) {
      return error
    }
  }

  public async listarTokens(
    incluirSuspendidos: boolean
  ): Promise<Datos.TokenStruct[]> {
    if (!this._contract) {
      return []
    }

    return (await this._contract.listarTokens(
      incluirSuspendidos
    )) as Datos.TokenStruct[]
  }

  // todo: falta agregar los parametros de entrada
  public BuscarTokens(ticker: string) {
    // todo: aqui hay que llamar al contrato
    const data = listaTokens.filter((t) => {
      return ticker != '' ? t.ticker == ticker : true
    })
    return data
  }

  public BuscarOrdenes(
    billetera?: Billeteras,
    tipo?: TiposOrdenes,
    tokenCompra?: Tokens,
    tokenVenta?: Tokens,
    montoCompra?: bigint,
    montoVenta?: bigint,
    estado?: EstadosOrdenes,
    fechaInicio?: string,
    fechaFin?: string
  ) {
    // todo: aqui hay que llamar al contrato
    const data = listaTodasOrdenes.filter((o) => {
      return o.estado == estado
    })
    return data
  }

  public CancelarOrden(idOrden: string): boolean {
    console.log('Orden con el id: ' + idOrden)
    return true
  }

  public EjecutarOrden(
    tipo: TiposOrdenes,
    idOrden: string,
    comprador: Billeteras
  ): boolean {
    console.log(
      `Orden del tipo: ${tipo} con el id: ${idOrden} por el usuario: ${comprador.direccion}`
    )
    return true
  }

  public static ActivarToken(ticker: string): boolean {
    // modificar para traer de la blockchain
    for (const token of listaTokens) {
      if (token.ticker == ticker) {
        token.estado = Estados.activo
        return true
      }
    }
    return false
  }

  public static SuspenderToken(ticker: string): boolean {
    // modificar para traer de la blockchain
    for (const token of listaTokens) {
      if (token.ticker == ticker) {
        token.estado = Estados.suspendido
        return true
      }
    }
    return false
  }
}
