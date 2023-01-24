import Plataforma from '@artifacts/Plataforma.sol/Plataforma.json'
import {
  ERROR_DESCONOCIDO,
  ERROR_NO_CONTRACT_ADDRESS,
  ERROR_NO_METAMASK,
  ERROR_NO_SIGNER,
  NOMBRE_TOKEN_SESION,
} from '@lib/constants/mensajes'
import { TiposOrdenes } from '@lib/types.d'
import dotenv from 'dotenv'
import { BigNumber, ethers } from 'ethers'
import { Datos, Plataforma as IPlataforma } from '../typechain-types/'
import {
  formatArrayBilleteras,
  formatArrayOrdenes,
  formatArrayTokens,
} from './helpers'
import { Session } from './types'
dotenv.config()

const { PLATFORM_CONTRACT_ADDRESS } = process.env

export default class BlockchainAdapter {
  private static _gestor: BlockchainAdapter
  private _provider: ethers.providers.JsonRpcProvider
  private _signer: ethers.providers.JsonRpcSigner
  private _contract: IPlataforma

  private constructor() {
    this._provider = {} as
      | ethers.providers.Web3Provider
      | ethers.providers.JsonRpcProvider
    this._signer = {} as ethers.providers.JsonRpcSigner
    this._contract = {} as IPlataforma
  }

  public static instanciar(): BlockchainAdapter {
    if (!this._gestor) {
      BlockchainAdapter._gestor = new BlockchainAdapter()
      BlockchainAdapter._gestor.iniciar()
    }

    return BlockchainAdapter._gestor
  }

  /**
   * @function iniciar inicia los elementos de ethers necesarios para interactuar con el contrato
   * @returns {Error | null} devuelve error si no se pudo iniciar y nulo si todo está en orden
   */
  public async iniciar(): Promise<Error | null> {
    if (!window.ethereum) {
      return new Error(ERROR_NO_METAMASK)
    }

    try {
      if (!this._provider._isProvider) {
        this._provider = new ethers.providers.Web3Provider(
          window.ethereum,
          'any'
        )
      }

      this._signer = await this._provider.getSigner()

      if (!this._signer._isSigner) {
        throw Error(ERROR_NO_SIGNER)
      }

      if (!PLATFORM_CONTRACT_ADDRESS) {
        throw Error(ERROR_NO_CONTRACT_ADDRESS)
      }

      this._contract = new ethers.Contract(
        PLATFORM_CONTRACT_ADDRESS,
        Plataforma.abi,
        this._signer
      ) as IPlataforma

      return null
    } catch (error: any) {
      return error
    }
  }

  /**
   * Método para solicitar permisos a la billetera para ver sus datos
   * @returns {Error | null} devuelve error si no se pudo realizar y nulo si todo está en orden
   * @dev solo se pide permiso una vez, el usuario tiene que quitarlos manualmente desde la wallet
   */
  public async conectarWallet(): Promise<Error | Session> {
    if (!this._provider._isProvider) {
      return new Error(ERROR_NO_METAMASK)
    }

    if (!this._signer._isSigner) {
      return new Error(ERROR_NO_SIGNER)
    }

    try {
      await this._provider.send!('eth_requestAccounts', [])

      const data: Session = {
        chainId: await this._signer.getChainId(),
        address: await this._signer.getAddress(),
        date: Date.now(),
      }

      const sesion = JSON.parse(
        localStorage.getItem(`${NOMBRE_TOKEN_SESION}:${data.address}`)!
      ) as Session

      if (!sesion) {
        localStorage.setItem(
          `${NOMBRE_TOKEN_SESION}:${data.address}`,
          JSON.stringify(data)
        )
      }

      return sesion
    } catch (error: any) {
      return error
    }
  }

  /**
   * Método para "desconectar" la billetera de la aplicación
   * @returns {Error | null} devuelve error si no se pudo realizar y nulo si todo está en orden
   * @dev es un acto simbólico en realidad no se quita permisos desde la aplicación
   */
  public async desconectarWallet(): Promise<Error | null> {
    if (!this._signer._isSigner) {
      return new Error(ERROR_NO_SIGNER)
    }

    try {
      const address = await this._signer.getAddress()
      const sesion = localStorage.getItem(`${NOMBRE_TOKEN_SESION}:${address}`)

      if (sesion) {
        localStorage.removeItem(`${NOMBRE_TOKEN_SESION}:${address}`)
      }
      return null
    } catch (error: any) {
      return new Error(ERROR_DESCONOCIDO)
    }
  }

  public async tokens(inlcuirActivos: boolean): Promise<Datos.TokenStruct[]> {
    try {
      const resultado = await this._contract.listarTokens(inlcuirActivos)

      return formatArrayTokens(resultado)
    } catch (error) {
      return []
    }
  }

  public async nuevoToken(
    contrato: string,
    oraculo: string
  ): Promise<Error | null> {
    try {
      const transaccion = await this._contract.nuevoToken(contrato, oraculo)

      await transaccion.wait()
      return null
    } catch (error: any) {
      return error
    }
  }

  public async activarToken(ticker: string): Promise<Error | null> {
    try {
      const transaccion = await this._contract.activarToken(ticker)

      await transaccion.wait()
      return null
    } catch (error: any) {
      return error
    }
  }

  public async suspenderToken(ticker: string): Promise<Error | null> {
    try {
      const transaccion = await this._contract.suspenderToken(ticker)

      await transaccion.wait()
      return null
    } catch (error: any) {
      return error
    }
  }

  public async modificarOraculoToken(
    ticker: string,
    oraculo: string
  ): Promise<Error | null> {
    try {
      const transaccion = await this._contract.modifcarOraculo(ticker, oraculo)

      await transaccion.wait()
      return null
    } catch (error: any) {
      return error
    }
  }

  public async historialOrdenes(): Promise<Datos.OrdenStruct[]> {
    try {
      const resultado = await this._contract.listarMisOrdenes()

      return formatArrayOrdenes(resultado)
    } catch (error) {
      return []
    }
  }

  public async listarOrdenesActivas(
    idOrdenBase: string,
    ventana: number
  ): Promise<Datos.OrdenStruct[]> {
    try {
      const resultado = await this._contract.listarOrdenesActivas(
        idOrdenBase,
        ventana
      )

      return formatArrayOrdenes(resultado)
    } catch (error) {
      return []
    }
  }

  public async nuevaOrden(
    tokenCompra: string,
    tokenVenta: string,
    montoCompra: BigNumber,
    montoVenta: BigNumber,
    tipo: TiposOrdenes
  ): Promise<Error | null> {
    try {
      const transaccion = await this._contract.nuevaOrden(
        tokenCompra,
        tokenVenta,
        montoCompra,
        montoVenta,
        tipo
      )

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async cancelarOrden(idOrden: string): Promise<Error | null> {
    try {
      const transaccion = await this._contract.cancelarOrden(idOrden)

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async ejecutarOrden(idOrden: string): Promise<Error | null> {
    try {
      const transaccion = await this._contract.ejecutarOrden(idOrden)

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async bloquearPlataforma(): Promise<Error | null> {
    try {
      const transaccion = await this._contract.bloquearPlataforma()

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async desbloquearPlataforma(): Promise<Error | null> {
    try {
      const transaccion = await this._contract.desbloquearPlataforma()

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async montoMinimoIntercambio(monto: BigNumber): Promise<Error | null> {
    try {
      const transaccion = await this._contract.establecerMontoMinimo(monto)

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async bloquearBilletera(direccion: string): Promise<Error | null> {
    try {
      const transaccion = await this._contract.bloquearBilletera(direccion)

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async desbloquearBilletera(direccion: string): Promise<Error | null> {
    try {
      const transaccion = await this._contract.desbloquearBilletera(direccion)

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async billeterasBloqueadas(): Promise<Datos.BilleteraStruct[]> {
    try {
      const resultado = await this._contract.listarBilleterasBloqueadas()

      return formatArrayBilleteras(resultado)
    } catch (error) {
      return []
    }
  }

  public async nuevoAdministrador(direccion: string): Promise<Error | null> {
    try {
      const transaccion = await this._contract.hacerAdministrador(direccion)

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async quitarAdministrador(direccion: string): Promise<Error | null> {
    try {
      const transaccion = await this._contract.quitarAdministrador(direccion)

      await transaccion.wait()

      return null
    } catch (error: any) {
      return error
    }
  }

  public async administradores(): Promise<Datos.BilleteraStruct[]> {
    try {
      const resultado = await this._contract.listarBilleterasBloqueadas()

      return formatArrayBilleteras(resultado)
    } catch (error) {
      return []
    }
  }
}
