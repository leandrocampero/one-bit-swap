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

import {
  ERROR_AUTENTICAR_BILLETERA,
  ERROR_BILLETERA_SUSPENDIDA,
  ERROR_NO_CONTRACT_ADDRESS,
  ERROR_NO_SIGNER,
} from '@/constants/mensajes'
import {
  administradoresReducer,
  bloqueadosReducer,
  ordenesReducer,
  plataformaReducer,
  sesionReducer,
  tokensReducer,
  transaccionReducer,
} from '@/context/blockchainReducer'
import {
  BlockchainActions,
  BlockchainGetters,
  DATOS_INITIAL_STATE,
  PLATAFORMA_INITIAL_STATE,
  ReducerActionType,
  SESION_INITIAL_STATE,
  TRANSACCION_INITIAL_STATE,
} from '@/context/context.d'
import Plataforma from '@/contracts/contracts/Plataforma.sol/Plataforma.json'
import deploy from '@/contracts/deploy.json'
import { AppProps, Estados, Orden, TiposOrdenes } from '@/types.d'
import {
  formatArrayBilleteras,
  formatArrayOrdenes,
  formatBilletera,
  formatOrden,
  sleep,
} from '@/utils/helpers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Plataforma as ContratoPlataforma } from '@one-bit-swap/hardhat/typechain-types/'
import { ethers } from 'ethers'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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

const ORDENES_OFFSET = 20

type BlockchainContextProps = {
  actions: BlockchainActions
  getters: BlockchainGetters
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

export const BlockchainContext = createContext<BlockchainContextProps>(
  {} as BlockchainContextProps
)

export const BlockchainProvider = (props: AppProps) => {
  //**************************************************************************//
  //                                                                          //
  //                   #####                                                  //
  //                  #     #  #####    ##    #####  ######                   //
  //                  #          #     #  #     #    #                        //
  //                   #####     #    #    #    #    #####                    //
  //                        #    #    ######    #    #                        //
  //                  #     #    #    #    #    #    #                        //
  //                   #####     #    #    #    #    ######                   //
  //                                                                          //
  //**************************************************************************//

  const [plataforma, reducePlataforma] = useReducer(
    plataformaReducer,
    PLATAFORMA_INITIAL_STATE
  )

  const [ordenes, reduceOrdenes] = useReducer(
    ordenesReducer,
    DATOS_INITIAL_STATE
  )

  const [tokens, reduceTokens] = useReducer(tokensReducer, DATOS_INITIAL_STATE)

  const [administradores, reduceAdministradores] = useReducer(
    administradoresReducer,
    DATOS_INITIAL_STATE
  )

  const [bloqueados, reduceBloqueados] = useReducer(
    bloqueadosReducer,
    DATOS_INITIAL_STATE
  )

  const [transaccion, reduceTransaccion] = useReducer(
    transaccionReducer,
    TRANSACCION_INITIAL_STATE
  )

  const [sesion, reduceSesion] = useReducer(sesionReducer, SESION_INITIAL_STATE)

  /****************************************************************************/

  const [contract, setContract] = useState<ContratoPlataforma | null>(null)
  const [contractAddress, setContractAddress] = useState<string>('')
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined)

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

  const setupContract = useCallback(
    (newSigner?: JsonRpcSigner): ContratoPlataforma => {
      if (contract !== null) {
        return contract
      }

      const selectedSigner = newSigner ?? signer

      if (!selectedSigner) {
        throw new Error(ERROR_NO_SIGNER)
      }

      setSigner(newSigner)

      if (contractAddress == '') {
        throw new Error(ERROR_NO_CONTRACT_ADDRESS)
      }

      const newContract = new ethers.Contract(
        contractAddress,
        Plataforma,
        selectedSigner
      ) as ContratoPlataforma

      setContract(newContract)

      return newContract
    },
    [contract, signer, contractAddress]
  )

  //**************************************************************************//
  //                                                                          //
  //            #######                                                       //
  //            #     #  #####   #####   ######  #####    ####                //
  //            #     #  #    #  #    #  #       #    #  #                    //
  //            #     #  #    #  #    #  #####   #    #   ####                //
  //            #     #  #####   #    #  #       #####        #               //
  //            #     #  #   #   #    #  #       #   #   #    #               //
  //            #######  #    #  #####   ######  #    #   ####                //
  //                                                                          //
  //**************************************************************************//

  const cargarOrdenesActivas = useCallback(
    async (base: string) => {
      reduceOrdenes({ type: ReducerActionType.MARCAR_CARGANDO })
      await sleep()

      try {
        const contractTemp = setupContract()
        const resultado = formatArrayOrdenes(
          await contractTemp.listarOrdenesActivas(base, ORDENES_OFFSET)
        )

        reduceOrdenes({
          type: ReducerActionType.GUARDAR_DATOS,
          payload: {
            ordenes: resultado,
            sobrescribir: base === ethers.constants.HashZero,
          },
        })
      } catch (error: any) {
        reduceOrdenes({
          type: ReducerActionType.MARCAR_ERROR,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const cargarOrdenesPropias = useCallback(async () => {
    reduceOrdenes({ type: ReducerActionType.MARCAR_CARGANDO })
    await sleep()

    try {
      const contract = setupContract()
      const resultado = formatArrayOrdenes(await contract.listarMisOrdenes())

      reduceOrdenes({
        type: ReducerActionType.GUARDAR_DATOS,
        payload: { ordenes: resultado, sobrescribir: true },
      })
    } catch (error: any) {
      reduceOrdenes({
        type: ReducerActionType.MARCAR_ERROR,
        payload: error.message,
      })
    }
  }, [setupContract])

  const nuevaOrden = useCallback(
    async (
      tokenCompra: string,
      tokenVenta: string,
      montoCompra: string,
      montoVenta: string,
      tipo: TiposOrdenes
    ) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.nuevaOrden(
          tokenCompra,
          tokenVenta,
          ethers.utils.parseEther(montoCompra),
          ethers.utils.parseEther(montoVenta),
          tipo
        )
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const cancelarOrden = useCallback(
    async (idOrden: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.cancelarOrden(idOrden)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const ejecutarOrden = useCallback(
    async (idOrden: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.ejecutarOrden(idOrden)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const buscarOrdenEspejo = useCallback(
    async (
      tokenCompra: string,
      tokenVenta: string,
      montoCompra: string,
      montoVenta: string
    ): Promise<Orden | null> => {
      try {
        const contract = setupContract()
        const resultado = formatOrden(
          await contract.buscarOrdenEspejo(
            tokenCompra,
            tokenVenta,
            montoCompra,
            montoVenta
          )
        )

        return resultado
      } catch (error) {
        return null
      }
    },
    [setupContract]
  )

  //**************************************************************************//
  //                                                                          //
  //            #######                                                       //
  //               #      ####   #    #  ######  #    #   ####                //
  //               #     #    #  #   #   #       ##   #  #                    //
  //               #     #    #  ####    #####   # #  #   ####                //
  //               #     #    #  #  #    #       #  # #       #               //
  //               #     #    #  #   #   #       #   ##  #    #               //
  //               #      ####   #    #  ######  #    #   ####                //
  //                                                                          //
  //**************************************************************************//

  const cargarTokens = useCallback(
    async (incluirSuspendidos: boolean) => {
      reduceTokens({ type: ReducerActionType.MARCAR_CARGANDO })
      await sleep()

      try {
        const contract = setupContract()
        const resultado = await contract.listarTokens(incluirSuspendidos)

        reduceTokens({
          type: ReducerActionType.GUARDAR_DATOS,
          payload: resultado,
        })
      } catch (error: any) {
        reduceTokens({
          type: ReducerActionType.MARCAR_ERROR,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const nuevoToken = useCallback(
    async (contrato: string, oraculo: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.nuevoToken(contrato, oraculo)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const activarToken = useCallback(
    async (ticker: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.activarToken(ticker)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const suspenderToken = useCallback(
    async (ticker: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.suspenderToken(ticker)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const modificarOraculoToken = useCallback(
    async (ticker: string, oraculo: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.modifcarOraculo(ticker, oraculo)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  //**************************************************************************//
  //                                                                          //
  //     ######                                                               //
  //     #     #  #         ##    #####  ######   ####   #####   #    #       //
  //     #     #  #        #  #     #    #       #    #  #    #  ##  ##       //
  //     ######   #       #    #    #    #####   #    #  #    #  # ## #       //
  //     #        #       ######    #    #       #    #  #####   #    #       //
  //     #        #       #    #    #    #       #    #  #   #   #    #       //
  //     #        ######  #    #    #    #        ####   #    #  #    #       //
  //                                                                          //
  //**************************************************************************//

  const cargarDatosPlataforma = useCallback(async () => {
    reducePlataforma({ type: ReducerActionType.MARCAR_CARGANDO })
    await sleep()

    try {
      const contract = setupContract()
      const { estado, propietario, montoMinimoUSD } =
        await contract.plataforma()

      reducePlataforma({
        type: ReducerActionType.GUARDAR_DATOS,
        payload: {
          estado,
          propietario,
          montoMinimo: montoMinimoUSD.toNumber(),
        },
      })
    } catch (error: any) {
      reducePlataforma({
        type: ReducerActionType.MARCAR_ERROR,
        payload: error.message,
      })
    }
  }, [setupContract])

  const bloquearPlataforma = useCallback(async () => {
    reduceTransaccion({
      type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
    })
    await sleep()

    try {
      const contract = setupContract()
      const receipt = await contract.bloquearPlataforma()
      await receipt.wait()

      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
      })
    } catch (error: any) {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
        payload: error.message,
      })
    }
  }, [setupContract])

  const desbloquearPlataforma = useCallback(async () => {
    reduceTransaccion({
      type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
    })
    await sleep()

    try {
      const contract = setupContract()
      const receipt = await contract.desbloquearPlataforma()
      await receipt.wait()

      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
      })
    } catch (error: any) {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
        payload: error.message,
      })
    }
  }, [setupContract])

  const cambiarMontoMinimoPlataforma = useCallback(
    async (montoMinimoUSD: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.establecerMontoMinimo(montoMinimoUSD)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  //**************************************************************************//
  //                                                                          //
  //                  #                                                       //
  //                 # #    #####   #    #  #  #    #   ####                  //
  //                #   #   #    #  ##  ##  #  ##   #  #                      //
  //               #     #  #    #  # ## #  #  # #  #   ####                  //
  //               #######  #    #  #    #  #  #  # #       #                 //
  //               #     #  #    #  #    #  #  #   ##  #    #                 //
  //               #     #  #####   #    #  #  #    #   ####                  //
  //                                                                          //
  //**************************************************************************//

  const cargarAdministradores = useCallback(async () => {
    reduceAdministradores({ type: ReducerActionType.MARCAR_CARGANDO })
    await sleep()

    try {
      const contract = setupContract()
      const resultado = formatArrayBilleteras(
        await contract.listarAdministradores()
      )

      reduceAdministradores({
        type: ReducerActionType.GUARDAR_DATOS,
        payload: resultado,
      })
    } catch (error: any) {
      reduceAdministradores({
        type: ReducerActionType.MARCAR_ERROR,
        payload: error.message,
      })
    }
  }, [setupContract])

  const nuevoAdministrador = useCallback(
    async (billetera: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.hacerAdministrador(billetera)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const quitarAdministrador = useCallback(
    async (billetera: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.quitarAdministrador(billetera)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  //**************************************************************************//
  //                                                                          //
  //        ######                                                            //
  //        #     #  #        ####    ####   #    #  ######  #####            //
  //        #     #  #       #    #  #    #  #   #   #       #    #           //
  //        ######   #       #    #  #       ####    #####   #    #           //
  //        #     #  #       #    #  #       #  #    #       #    #           //
  //        #     #  #       #    #  #    #  #   #   #       #    #           //
  //        ######   ######   ####    ####   #    #  ######  #####            //
  //                                                                          //
  //**************************************************************************//

  const cargarBloqueados = useCallback(async () => {
    reduceBloqueados({ type: ReducerActionType.MARCAR_CARGANDO })
    await sleep()

    try {
      const contract = setupContract()
      const resultado = formatArrayBilleteras(
        await contract.listarBilleterasBloqueadas()
      )

      reduceBloqueados({
        type: ReducerActionType.GUARDAR_DATOS,
        payload: resultado,
      })
    } catch (error: any) {
      reduceBloqueados({
        type: ReducerActionType.MARCAR_ERROR,
        payload: error.message,
      })
    }
  }, [setupContract])

  const bloquearBilletera = useCallback(
    async (billetera: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.bloquearBilletera(billetera)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const desbloquearBilletera = useCallback(
    async (billetera: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const contract = setupContract()
        const receipt = await contract.desbloquearBilletera(billetera)
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
      } catch (error: any) {
        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  //**************************************************************************//
  //                                                                          //
  //            #####                                                         //
  //           #     #  ######   ####    ####   #   ####   #    #             //
  //           #        #       #       #       #  #    #  ##   #             //
  //            #####   #####    ####    ####   #  #    #  # #  #             //
  //                 #  #            #       #  #  #    #  #  # #             //
  //           #     #  #       #    #  #    #  #  #    #  #   ##             //
  //            #####   ######   ####    ####   #   ####   #    #             //
  //                                                                          //
  //**************************************************************************//

  /**
   * Busca los datos de la billetera para validarlos en el contrato
   * @param signer es el signer provisto para inicar la conexión
   */
  const autenticarBilletera = useCallback(
    async (signer: JsonRpcSigner): Promise<void> => {
      reduceSesion({ type: ReducerActionType.MARCAR_CARGANDO })
      await sleep()

      try {
        const contract = setupContract(signer)
        const direccion = await signer.getAddress()

        const billetera = formatBilletera(
          await contract.buscarBilletera(direccion)
        )

        const { estado, rol } = billetera

        if (estado === Estados.suspendido) {
          throw new Error(ERROR_BILLETERA_SUSPENDIDA)
        }

        reduceSesion({
          type: ReducerActionType.GUARDAR_DATOS,
          payload: { account: direccion, estado, rol },
        })
      } catch (error: any) {
        reduceSesion({
          type: ReducerActionType.MARCAR_ERROR,
          payload: error.message,
        })
        throw new Error(ERROR_AUTENTICAR_BILLETERA)
      }
    },
    [setupContract]
  )

  //**************************************************************************//
  //                                                                          //
  //           #####                                                          //
  //          #     #  ######  #####  #####  ######  #####    ####            //
  //          #        #         #      #    #       #    #  #                //
  //          #  ####  #####     #      #    #####   #    #   ####            //
  //          #     #  #         #      #    #       #####        #           //
  //          #     #  #         #      #    #       #   #   #    #           //
  //           #####   ######    #      #    ######  #    #   ####            //
  //                                                                          //
  //**************************************************************************//

  const getPlataforma = useMemo(() => plataforma, [plataforma])
  const getOrdenes = useMemo(() => ordenes, [ordenes])
  const getTokens = useMemo(() => tokens, [tokens])
  const getAdministradores = useMemo(() => administradores, [administradores])
  const getBloqueados = useMemo(() => bloqueados, [bloqueados])
  const getTransaccion = useMemo(() => transaccion, [transaccion])
  const getSesion = useMemo(() => sesion, [sesion])

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

  // // Limpiar estado al desmontar componente
  // useEffect(() => {
  //   return () => {
  //     dispatch({
  //       type: ReducerActionType.REINICIAR_ESTADO,
  //       payload: INITIAL_STATE,
  //     })
  //   }
  // }, [])

  // Leer dirección del contrato
  useEffect(() => {
    setContractAddress(deploy.platform)
  }, [])

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

  const actions: BlockchainActions = {
    cargarOrdenesActivas,
    cargarOrdenesPropias,
    nuevaOrden,
    cancelarOrden,
    ejecutarOrden,
    buscarOrdenEspejo,
    cargarTokens,
    nuevoToken,
    activarToken,
    suspenderToken,
    modificarOraculoToken,
    cargarDatosPlataforma,
    bloquearPlataforma,
    desbloquearPlataforma,
    cambiarMontoMinimoPlataforma,
    cargarAdministradores,
    nuevoAdministrador,
    quitarAdministrador,
    cargarBloqueados,
    bloquearBilletera,
    desbloquearBilletera,
    autenticarBilletera,
  } as BlockchainActions

  const getters: BlockchainGetters = {
    plataforma: getPlataforma,
    ordenes: getOrdenes,
    tokens: getTokens,
    administradores: getAdministradores,
    bloqueados: getBloqueados,
    transaccion: getTransaccion,
    session: getSesion,
  }

  return (
    <BlockchainContext.Provider value={{ actions, getters }}>
      {props.children}
    </BlockchainContext.Provider>
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
export const useBlockchainContext = () => useContext(BlockchainContext)
