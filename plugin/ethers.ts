import { ethers, utils } from 'ethers'
import { IBlockchain } from '../lib/types'

export default class EtherPlugin {
  private provider: ethers.providers.Web3Provider
  private signer: ethers.providers.JsonRpcSigner
  public utils: typeof utils

  constructor() {
    this.provider = this.getProvider()
    this.signer = this.getSigner()
    this.utils = utils
  }

  getProvider() {
    if (this.provider) {
      return this.provider
    }

    if (!window.ethereum) {
      /* throw parseError(new Error('instale metamask')) */
    }
    this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')

    this.provider.on('network', (_, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload()
      }
    })

    return this.provider
  }

  getSigner() {
    if (this.signer) {
      return this.signer
    }

    const provider = this.getProvider()

    this.signer = provider.getSigner()
    return this.signer
  }

  async getChainId() {
    const signer = this.getSigner()

    return await signer.getChainId()
  }

  async getAddress() {
    const signer = this.getSigner()

    return await signer.getAddress()
  }

  async cambiarRed(red: IBlockchain) {
    if (!this.provider) {
      return
    }

    if (!this.provider.provider.request) {
      return
    }

    const hex = '0x' + red.chainId.toString(16)

    try {
      return await this.provider.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hex }],
      })
    } catch (error: any) {
      // Red no encontrada en Metamask
      if (error?.code === 4902) {
        try {
          return await this.provider.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hex,
                rpcUrls: [red.RPCUrl],
                chainName: red.blockchain,
                nativeCurrency: {
                  name: red.nativeToken,
                  symbol: red.nativeToken,
                  decimals: 18,
                },
              },
            ],
          })
        } catch (addError) {
          return addError
        }
      }
      return error
    }
  }

  newContract(
    address: string,
    abi: string,
    signer?: ethers.providers.JsonRpcSigner
  ) {
    if (!signer && !this.signer) {
      /* throw parseError(new Error('instale metamask')) */
    }

    return new ethers.Contract(address, abi, signer ?? this.signer)
  }
}
