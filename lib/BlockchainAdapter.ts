import Plataforma from '@artifacts/Plataforma.sol/Plataforma.json'
import { Mensajes } from '@lib/constants/error'
import { Datos } from '@typechain/contracts/GestorTokens'
import { Plataforma as PlataformaInterface } from '@typechain/contracts/Plataforma'
import { ethers } from 'ethers'
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
}
