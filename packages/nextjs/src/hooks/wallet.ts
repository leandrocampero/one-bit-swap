import { ERROR_NO_METAMASK } from '@/constants/mensajes'
import networks from '@/contracts/networks'
import {
  ExternalProvider,
  JsonRpcSigner,
  Network,
  Web3Provider,
} from '@ethersproject/providers'
import { useCallback, useState } from 'react'

declare global {
  interface Window {
    ethereum: ExternalProvider
  }
}

type ExtensionForProvider = {
  on: (event: string, callback: (...params: any) => void) => void
}

// Adds on stream support for listening events.
// see https://github.com/ethers-io/ethers.js/discussions/3230
type GenericProvider = ExternalProvider & ExtensionForProvider

interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

function useWallet() {
  const [provider, setProvider] = useState<Web3Provider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [accounts, setAccounts] = useState<string[]>([])
  const [network, setNetwork] = useState<Network | null>(null)

  const setupProvider = useCallback(async () => {
    //************************************************************************//
    //                                                                        //
    //                  Check the existence of the Provider                   //
    //                                                                        //
    //************************************************************************//
    if (!window.ethereum) throw Error(ERROR_NO_METAMASK)
    if (provider) return provider

    const newProvider = new Web3Provider(window.ethereum)
    const genericProvider = window.ethereum as GenericProvider

    //************************************************************************//
    //                                                                        //
    //                         Create Event Listeners                         //
    //                                                                        //
    //************************************************************************//

    genericProvider.on('accountsChanged', (acc: string[]) => {
      setAccounts(acc)
    })

    genericProvider.on('chainChanged', async () => {
      window.location.reload()
    })

    genericProvider.on('disconnect', (error: ProviderRpcError) => {
      throw Error(error.message)
    })

    //************************************************************************//
    //                                                                        //
    //                        Compare current network                         //
    //                 Switch to the correct one if necessary                 //
    //                                                                        //
    //************************************************************************//
    const mode = process.env.NODE_ENV as keyof typeof networks
    const networkToSwitch = networks[mode]
    const { chainId, blockExplorerUrls, chainName, nativeCurrency, rpcUrls } =
      networkToSwitch

    const network: Network = await newProvider.getNetwork()

    const currentChainIdHex = `0x${network.chainId.toString(16)}`
    if (currentChainIdHex !== chainId) {
      try {
        await newProvider.send('wallet_switchEthereumChain', [{ chainId }])
        window.location.reload()
      } catch (error: any) {
        // Red no encontrada en Metamask
        if (error?.code === 4902) {
          try {
            await newProvider.send('wallet_addEthereumChain', [
              {
                chainId,
                rpcUrls,
                chainName,
                nativeCurrency,
                blockExplorerUrls,
              },
            ])
          } catch (addError) {}
        }
      }
    }

    //************************************************************************//
    //                                                                        //
    //                             Save Provider                              //
    //                                                                        //
    //************************************************************************//

    setProvider(newProvider)

    return newProvider
  }, [provider])

  const connect = useCallback(async () => {
    const provider = await setupProvider()
    const accounts: string[] = await provider.send('eth_requestAccounts', [])
    const network: Network = await provider.getNetwork()
    const signer: JsonRpcSigner = provider.getSigner()
    setNetwork(network)
    setAccounts(accounts)
    setSigner(signer)
  }, [setupProvider])

  const getAccounts = useCallback(async () => {
    const provider = await setupProvider()
    const accounts: string[] = await provider.send('eth_accounts', [])
    setAccounts(accounts)
    return accounts
  }, [setupProvider])

  return {
    signer,
    accounts,
    network,
    connect,
    getAccounts,
  }
}

export { useWallet }
