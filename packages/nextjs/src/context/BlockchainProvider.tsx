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
import { blockchainReducer } from '@/context/blockchainReducer'
import {
  BlockchainActions,
  BlockchainState,
  ReducerActionType,
} from '@/context/context.d'
import Plataforma from '@/contracts/contracts/Plataforma.sol/Plataforma.json'
import deploy from '@/contracts/deploy.json'
import {
  AppProps,
  Estados,
  Orden,
  RolesBilleteras,
  TiposOrdenes,
} from '@/types.d'
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

const INITIAL_STATE: BlockchainState = {
  plataforma: {
    datos: { contrato: '', montoMinimo: 0, estado: Estados.activo },
    cargando: false,
    error: null,
  },
  ordenes: { datos: [], cargando: false, error: null },
  tokens: { datos: [], cargando: false, error: null },
  administradores: { datos: [], cargando: false, error: null },
  bloqueados: { datos: [], cargando: false, error: null },
  transaccion: { cargando: false, error: null },
  sesion: {
    cargando: false,
    error: null,
    datos: {
      direccion: '',
      estado: Estados.activo,
      rol: RolesBilleteras.usuario,
    },
  },
}

const ORDENES_OFFSET = 20

type BlockchainContextProps = {
  state: BlockchainState
  actions: BlockchainActions
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

  const [state, dispatch] = useReducer(blockchainReducer, INITIAL_STATE)
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
  //               #                                                          //
  //              # #     ####   #####  #   ####   #    #   ####              //
  //             #   #   #    #    #    #  #    #  ##   #  #                  //
  //            #     #  #         #    #  #    #  # #  #   ####              //
  //            #######  #         #    #  #    #  #  # #       #             //
  //            #     #  #    #    #    #  #    #  #   ##  #    #             //
  //            #     #   ####     #    #   ####   #    #   ####              //
  //                                                                          //
  //**************************************************************************//

  const cargarOrdenesActivas = useCallback(
    async (base: string) => {
      dispatch({ type: ReducerActionType.MARCAR_CARGANDO_ORDENES })
      await sleep()

      try {
        const contractTemp = setupContract()
        const resultado = formatArrayOrdenes(
          await contractTemp.listarOrdenesActivas(base, ORDENES_OFFSET)
        )

        dispatch({
          type: ReducerActionType.GUARDAR_ORDENES,
          payload: { ordenes: resultado, sobrescribir: false },
        })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_ERROR_ORDENES,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const cargarTokens = useCallback(
    async (incluirSuspendidos: boolean) => {
      dispatch({ type: ReducerActionType.MARCAR_CARGANDO_TOKENS })
      await sleep()

      try {
        const contract = setupContract()
        const resultado = await contract.listarTokens(incluirSuspendidos)

        dispatch({
          type: ReducerActionType.GUARDAR_TOKENS,
          payload: resultado,
        })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_ERROR_TOKENS,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const cargarOrdenesPropias = useCallback(async () => {
    dispatch({ type: ReducerActionType.MARCAR_CARGANDO_ORDENES })
    await sleep()

    try {
      const contract = setupContract()
      const resultado = formatArrayOrdenes(await contract.listarMisOrdenes())

      dispatch({
        type: ReducerActionType.GUARDAR_ORDENES,
        payload: { ordenes: resultado, sobrescribir: true },
      })
    } catch (error: any) {
      dispatch({
        type: ReducerActionType.MARCAR_ERROR_ORDENES,
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
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.nuevaOrden(
          tokenCompra,
          tokenVenta,
          ethers.utils.parseEther(montoCompra),
          ethers.utils.parseEther(montoVenta),
          tipo
        )

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const cancelarOrden = useCallback(
    async (idOrden: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.cancelarOrden(idOrden)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const ejecutarOrden = useCallback(
    async (idOrden: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.ejecutarOrden(idOrden)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
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

  const nuevoToken = useCallback(
    async (contrato: string, oraculo: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.nuevoToken(contrato, oraculo)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const activarToken = useCallback(
    async (ticker: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.activarToken(ticker)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const suspenderToken = useCallback(
    async (ticker: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.suspenderToken(ticker)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const modificarOraculoToken = useCallback(
    async (ticker: string, oraculo: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.modifcarOraculo(ticker, oraculo)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const cargarDatosPlataforma = useCallback(async () => {
    dispatch({ type: ReducerActionType.MARCAR_CARGANDO_PLATAFORMA })
    await sleep()

    try {
      const contract = setupContract()
      const { estado, propietario, montoMinimoUSD } =
        await contract.plataforma()

      dispatch({
        type: ReducerActionType.GUARDAR_DATOS_PLATAFORMA,
        payload: { estado, propietario, montoMinimoUSD },
      })
    } catch (error: any) {
      dispatch({
        type: ReducerActionType.MARCAR_ERROR_PLATAFORMA,
        payload: error.message,
      })
    }
  }, [setupContract])

  const bloquearPlataforma = useCallback(async () => {
    dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
    await sleep()

    try {
      const contract = setupContract()
      await contract.bloquearPlataforma()

      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
    } catch (error: any) {
      dispatch({
        type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
        payload: error.message,
      })
    }
  }, [setupContract])

  const desbloquearPlataforma = useCallback(async () => {
    dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
    await sleep()

    try {
      const contract = setupContract()
      await contract.desbloquearPlataforma()

      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
    } catch (error: any) {
      dispatch({
        type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
        payload: error.message,
      })
    }
  }, [setupContract])

  const cambiarMontoMinimoPlataforma = useCallback(
    async (montoMinimoUSD: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.establecerMontoMinimo(montoMinimoUSD)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const cargarAdministradores = useCallback(async () => {
    dispatch({ type: ReducerActionType.MARCAR_CARGANDO_ADMINISTRADORES })
    await sleep()

    try {
      const contract = setupContract()
      const resultado = formatArrayBilleteras(
        await contract.listarAdministradores()
      )

      dispatch({
        type: ReducerActionType.GUARDAR_ADMINISTRADORES,
        payload: resultado,
      })
    } catch (error: any) {
      dispatch({
        type: ReducerActionType.MARCAR_ERROR_ADMINISTRADORES,
        payload: error.message,
      })
    }
  }, [setupContract])

  const nuevoAdministrador = useCallback(
    async (billetera: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.hacerAdministrador(billetera)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const quitarAdministrador = useCallback(
    async (billetera: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.quitarAdministrador(billetera)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const cargarBloqueados = useCallback(async () => {
    dispatch({ type: ReducerActionType.MARCAR_CARGANDO_BLOQUEADOS })
    await sleep()

    try {
      const contract = setupContract()
      const resultado = formatArrayBilleteras(
        await contract.listarBilleterasBloqueadas()
      )

      dispatch({
        type: ReducerActionType.GUARDAR_BILLETERAS_BLOQUEADAS,
        payload: resultado,
      })
    } catch (error: any) {
      dispatch({
        type: ReducerActionType.MARCAR_ERROR_BLOQUEADOS,
        payload: error.message,
      })
    }
  }, [setupContract])

  const bloquearBilletera = useCallback(
    async (billetera: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.bloquearBilletera(billetera)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  const desbloquearBilletera = useCallback(
    async (billetera: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })
      await sleep()

      try {
        const contract = setupContract()
        await contract.desbloquearBilletera(billetera)

        dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: error.message,
        })
      }
    },
    [setupContract]
  )

  /**
   * Busca los datos de la billetera para validarlos en el contrato
   * @param signer es el signer provisto para inicar la conexión
   */
  const autenticarBilletera = useCallback(
    async (signer: JsonRpcSigner): Promise<void> => {
      dispatch({ type: ReducerActionType.MARCAR_CARGANDO_SESION })
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

        dispatch({
          type: ReducerActionType.GUARDAR_DATOS_SESION,
          payload: { account: direccion, estado, rol },
        })
      } catch (error: any) {
        dispatch({
          type: ReducerActionType.MARCAR_ERROR_SESION,
          payload: error.message,
        })
        throw new Error(ERROR_AUTENTICAR_BILLETERA)
      }
    },
    [setupContract]
  )

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

  // Limpiar estado al desmontar componente
  useEffect(() => {
    return () => {
      dispatch({
        type: ReducerActionType.REINICIAR_ESTADO,
        payload: INITIAL_STATE,
      })
    }
  }, [])

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

  return (
    <BlockchainContext.Provider value={{ state, actions }}>
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
