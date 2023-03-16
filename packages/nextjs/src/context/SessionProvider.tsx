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
import { AppProps } from '@/types'
import { sleep } from '@/utils/helpers'
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
  connect: () => Promise<void>
  disconnect: () => Promise<void>
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
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [injectedConnector, setInjectedConnector] = useState<
    InjectedConnector | undefined
  >(undefined)

  const router = useRouter()
  const { active, activate } = useWeb3React<Web3Provider>()

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

    setInjectedConnector(connector)
    return connector
  }, [injectedConnector])

  /**
   * Inicia el proceso de conexión con la billetera
   */
  const connect = useCallback(async () => {
    setLoading(true)

    try {
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
    return await sleep()
  }, [])

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

  // Si la billetera no está conectada redirigir
  useEffect(
    () => {
      if (!active) {
        setConnected(false)
        router.push('/conectar')
      }
    },
    //eslint-disable-next-line
    [active] //Si pongo router como dependencia se dispara muy seguido
  )

  //**************************************************************************//
  // Testing effects
  useEffect(() => {
    console.log('loading:', loading)
  }, [loading])

  //**************************************************************************//

  return (
    <SessionContext.Provider
      value={{ connected, loading, error, connect, disconnect }}
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
