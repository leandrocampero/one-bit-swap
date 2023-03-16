//**************************************************************************//
//                                                                          //
//            ###                                                           //
//             #   #    #  #####    ####   #####   #####   ####             //
//             #   ##  ##  #    #  #    #  #    #    #    #                 //
//             #   # ## #  #    #  #    #  #    #    #     ####             //
//             #   #    #  #####   #    #  #####     #         #            //
//             #   #    #  #       #    #  #   #     #    #    #            //
//            ###  #    #  #        ####   #    #    #     ####             //
//                                                                          //
//**************************************************************************//
import networks from '@/contracts/networks'
import { AppProps } from '@/types'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useRouter } from 'next/router'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

//**************************************************************************//
//                                                                          //
// ######                                                                   //
// #     #  ######  ######  #  #    #  #  #####  #   ####   #    #   ####   //
// #     #  #       #       #  ##   #  #    #    #  #    #  ##   #  #       //
// #     #  #####   #####   #  # #  #  #    #    #  #    #  # #  #   ####   //
// #     #  #       #       #  #  # #  #    #    #  #    #  #  # #       #  //
// #     #  #       #       #  #   ##  #    #    #  #    #  #   ##  #    #  //
// ######   ######  #       #  #    #  #    #    #   ####   #    #   ####   //
//                                                                          //
//**************************************************************************//

export type SessionContextProps = {
  connected: boolean
  loading: boolean
  error: string | null
  switchNetwork: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  changeNetwork: () => Promise<void>
}

//**************************************************************************//
//                                                                          //
//           #####                                                          //
//          #     #   ####   #    #  #####  ######  #    #  #####           //
//          #        #    #  ##   #    #    #        #  #     #             //
//          #        #    #  # #  #    #    #####     ##      #             //
//          #        #    #  #  # #    #    #         ##      #             //
//          #     #  #    #  #   ##    #    #        #  #     #             //
//           #####    ####   #    #    #    ######  #    #    #             //
//                                                                          //
//**************************************************************************//
export const SessionContext = createContext<SessionContextProps>(
  {} as SessionContextProps
)

//**************************************************************************//
//                                                                          //
//        ######                                                            //
//        #     #  #####    ####   #    #  #  #####   ######  #####         //
//        #     #  #    #  #    #  #    #  #  #    #  #       #    #        //
//        ######   #    #  #    #  #    #  #  #    #  #####   #    #        //
//        #        #####   #    #  #    #  #  #    #  #       #####         //
//        #        #   #   #    #   #  #   #  #    #  #       #   #         //
//        #        #    #   ####     ##    #  #####   ######  #    #        //
//                                                                          //
//**************************************************************************//

export const SessionProvider = (props: AppProps) => {
  const [connected, setConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [eagerTried, setEagerTry] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [switchNetwork, setSwitchNetwork] = useState<boolean>(false)

  const [injectedConnector, setInjectedConnector] = useState<
    InjectedConnector | undefined
  >(undefined)

  const router = useRouter()
  const { active, activate, deactivate } = useWeb3React<Web3Provider>()

  //**************************************************************************//
  //                                                                          //
  //  #####                                                                   //
  // #     #    ##    #       #       #####     ##     ####   #    #   ####   //
  // #         #  #   #       #       #    #   #  #   #    #  #   #   #       //
  // #        #    #  #       #       #####   #    #  #       ####     ####   //
  // #        ######  #       #       #    #  ######  #       #  #         #  //
  // #     #  #    #  #       #       #    #  #    #  #    #  #   #   #    #  //
  //  #####   #    #  ######  ######  #####   #    #   ####   #    #   ####   //
  //                                                                          //
  //**************************************************************************//

  /**
   * Devuelve una instancia de _injectedConnector_, similar a un _provider_
   */
  const setupInjectedConnector = useCallback((): InjectedConnector => {
    if (injectedConnector) return injectedConnector

    const connector = new InjectedConnector({
      supportedChainIds: [137, 80001, 31337], // Polygon, Mumbai, Hardhat
    })

    window.ethereum.on('chainChanged', async (chainIdHex: string) => {
      const mode = process.env.NODE_ENV as keyof typeof networks
      const networkToSwitch = networks[mode]
      const { chainId: expectedNetwork } = networkToSwitch

      setSwitchNetwork(chainIdHex !== expectedNetwork)
    })

    setInjectedConnector(connector)
    return connector
  }, [injectedConnector])

  /**
   * Compara la red a usar por la aplicación con la actual
   */
  const compareNetwork = useCallback(async () => {
    // Red actual
    const connector = setupInjectedConnector()
    const currentNetwork = await connector.getChainId()

    // Red esperada
    const mode = process.env.NODE_ENV as keyof typeof networks
    const networkToSwitch = networks[mode]
    const { chainId: expectedNetwork } = networkToSwitch

    setSwitchNetwork(currentNetwork !== expectedNetwork)
  }, [setupInjectedConnector])

  /**
   * Cambia la red a la esperada por la aplicación
   */
  const changeNetwork = useCallback(async () => {
    try {
      const mode = process.env.NODE_ENV as keyof typeof networks
      const networkToSwitch = networks[mode]
      const { chainId, blockExplorerUrls, chainName, nativeCurrency, rpcUrls } =
        networkToSwitch

      const connector = setupInjectedConnector()
      const provider = await connector.getProvider()

      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId }])
      } catch (error: any) {
        // Red no encontrada en Metamask
        if (error?.code === 4902) {
          try {
            await provider.send('wallet_addEthereumChain', [
              {
                chainId,
                rpcUrls,
                chainName,
                nativeCurrency,
                blockExplorerUrls,
              },
            ])

            await provider.send('wallet_switchEthereumChain', [{ chainId }])
          } catch (addError) {
            throw new Error(error.message)
          }
        }
      }
    } catch (error: any) {
      setError(error.message)
    }
  }, [setupInjectedConnector])

  /**
   * Inicia el proceso de conexión con la billetera
   */
  const connect = useCallback(async () => {
    try {
      setLoading(true)

      const connector = setupInjectedConnector()
      await activate(connector, undefined, true)

      setConnected(true)
      setError(null)
    } catch (error: any) {
      setConnected(false)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [setupInjectedConnector, activate])

  const disconnect = useCallback(async () => {
    try {
      setLoading(true)

      await deactivate()

      setConnected(false)
      setError(null)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [deactivate])

  //**************************************************************************//
  //                                                                          //
  //          #######                                                         //
  //          #        ######  ######  ######   ####   #####   ####           //
  //          #        #       #       #       #    #    #    #               //
  //          #####    #####   #####   #####   #         #     ####           //
  //          #        #       #       #       #         #         #          //
  //          #        #       #       #       #    #    #    #    #          //
  //          #######  #       #       ######   ####     #     ####           //
  //                                                                          //
  //**************************************************************************//

  // Si se inicia el componente, hay que cargar controlar primero si ya tiene permiso
  useEffect(() => {
    const eagerConnect = async () => {
      const injectedConnector = new InjectedConnector({
        supportedChainIds: [137, 80001, 31337], // Polygon, Mumbai, Hardhat
      })

      const isAuthorized = await injectedConnector.isAuthorized()

      if (isAuthorized) {
        try {
          await connect()
        } catch (error: any) {
          setEagerTry(true)
        }
      } else {
        setEagerTry(true)
        setLoading(false)
      }
    }

    if (eagerTried) {
      return
    } else {
      eagerConnect()
    }
  }, [connect, eagerTried])

  // Si la billetera no está conectada redirigir
  useEffect(
    () => {
      if (loading) return

      if (!active) {
        setConnected(false)
        router.push('/conectar')
      }
    },
    //eslint-disable-next-line
    [active, loading] //Si pongo router como dependencia se dispara muy seguido
  )

  // Si la red no es la correcta, solicitar el cambio
  useEffect(() => {
    compareNetwork()
  }, [compareNetwork])

  //**************************************************************************//

  return (
    <SessionContext.Provider
      value={{
        connected,
        loading,
        error,
        switchNetwork,
        connect,
        disconnect,
        changeNetwork,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  )
}

//**************************************************************************//
//                                                                          //
//       #     #                      #     #                               //
//       #     #   ####   ######      #     #   ####    ####   #    #       //
//       #     #  #       #           #     #  #    #  #    #  #   #        //
//       #     #   ####   #####       #######  #    #  #    #  ####         //
//       #     #       #  #           #     #  #    #  #    #  #  #         //
//       #     #  #    #  #           #     #  #    #  #    #  #   #        //
//        #####    ####   ######      #     #   ####    ####   #    #       //
//                                                                          //
//**************************************************************************//
export const useSessionContext = () => useContext(SessionContext)
