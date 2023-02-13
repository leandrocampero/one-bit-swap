/*******************************************************************************

#### ##     ## ########   #######  ########  ########  ######
 ##  ###   ### ##     ## ##     ## ##     ##    ##    ##    ##
 ##  #### #### ##     ## ##     ## ##     ##    ##    ##
 ##  ## ### ## ########  ##     ## ########     ##     ######
 ##  ##     ## ##        ##     ## ##   ##      ##          ##
 ##  ##     ## ##        ##     ## ##    ##     ##    ##    ##
#### ##     ## ##         #######  ##     ##    ##     ######

*******************************************************************************/
import {
  ERROR_NO_CONTRACT_ADDRESS,
  ERROR_NO_SIGNER,
} from '@/constants/mensajes'
import { BlockchainContext } from '@/context/BlockchainContext'
import { blockchainReducer } from '@/context/blockchainReducer'
import {
  BlockchainActions,
  BlockchainState,
  ReducerActionType,
} from '@/context/context.d'
import Plataforma from '@/contracts/contracts/Plataforma.sol/Plataforma.json'
import { useWallet } from '@/hooks/wallet'
import { AppProps, Estados, TiposOrdenes } from '@/types.d'
import { Plataforma as ContratoPlataforma } from '@one-bit-swap/hardhat/typechain-types/'
import { ethers } from 'ethers'
import { useCallback, useEffect, useReducer, useState } from 'react'
import deploy from '@/contracts/deploy.json'
import { formatArrayBilleteras, formatArrayOrdenes } from '@/utils/helpers'

/*******************************************************************************

 ######   #######  ##    ##  ######  ########    ###    ##    ## ########  ######
##    ## ##     ## ###   ## ##    ##    ##      ## ##   ###   ##    ##    ##    ##
##       ##     ## ####  ## ##          ##     ##   ##  ####  ##    ##    ##
##       ##     ## ## ## ##  ######     ##    ##     ## ## ## ##    ##     ######
##       ##     ## ##  ####       ##    ##    ######### ##  ####    ##          ##
##    ## ##     ## ##   ### ##    ##    ##    ##     ## ##   ###    ##    ##    ##
 ######   #######  ##    ##  ######     ##    ##     ## ##    ##    ##     ######

*******************************************************************************/

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
}

const ORDENES_OFFSET = 20

/*******************************************************************************

 ######   #######  ##    ## ######## ######## ##     ## ########
##    ## ##     ## ###   ##    ##    ##        ##   ##     ##
##       ##     ## ####  ##    ##    ##         ## ##      ##
##       ##     ## ## ## ##    ##    ######      ###       ##
##       ##     ## ##  ####    ##    ##         ## ##      ##
##    ## ##     ## ##   ###    ##    ##        ##   ##     ##
 ######   #######  ##    ##    ##    ######## ##     ##    ##

*******************************************************************************/

export const BlockchainProvider = (props: AppProps) => {
  //**************************************************************************//
  //                                                                          //
  //                          State and Custom Hooks                          //
  //                                                                          //
  //**************************************************************************//
  const [state, dispatch] = useReducer(blockchainReducer, INITIAL_STATE)
  const [contract, setContract] = useState<ContratoPlataforma | null>(null)
  const [contractAddress, setContractAddress] = useState<string>('')
  const { signer, connect, getAccounts } = useWallet()

  //**************************************************************************//
  //                                                                          //
  //                             Callbacks Hooks                              //
  //                                                                          //
  //**************************************************************************//

  const setupContract = useCallback((): ContratoPlataforma => {
    if (contract !== null) {
      return contract
    }

    if (signer === null) {
      throw new Error(ERROR_NO_SIGNER)
    }

    if (contractAddress == '') {
      throw new Error(ERROR_NO_CONTRACT_ADDRESS)
    }

    const newContract = new ethers.Contract(
      contractAddress,
      Plataforma,
      signer
    ) as ContratoPlataforma

    setContract(newContract)

    return newContract
  }, [contract, signer, contractAddress])

  //**************************************************************************//
  //                                                                          //
  //                             Reducer Actions                              //
  //                                                                          //
  //**************************************************************************//

  const conectarBilletera = useCallback(async () => {
    await connect()
  }, [connect])

  const cargarCuentasConectadas = useCallback(async () => {
    await getAccounts()
  }, [getAccounts])

  const cargarOrdenesActivas = useCallback(
    async (base: string) => {
      dispatch({ type: ReducerActionType.MARCAR_CARGANDO_ORDENES })

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

  const nuevoToken = useCallback(
    async (contrato: string, oraculo: string) => {
      dispatch({ type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO })

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

  //**************************************************************************//
  //                                                                          //
  //                               Effect Hooks                               //
  //    En desarrollo, con respecto a los hooks, react hace lo siguiente:     //
  //     Se dispara al renderizar un hook un ciclo completo, inicio y fin     //
  //                         Luego vuelve a disparar.                         //
  //               Es para asegurar el correcto funcionamiento.               //
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

  // Conectar billetera al iniciar
  useEffect(() => {
    conectarBilletera()
  }, [conectarBilletera])

  // Instanciar contrato
  useEffect(() => {
    let mountedLock = true

    if (mountedLock) {
      try {
        const newContract = new ethers.Contract(
          contractAddress,
          Plataforma,
          signer!
        ) as ContratoPlataforma
        setContract(newContract)
      } catch (error: any) {
        setContract(null)
      } finally {
        dispatch({
          type: ReducerActionType.REINICIAR_ESTADO,
          payload: INITIAL_STATE,
        })
      }
    }

    return () => {
      mountedLock = false
    }
  }, [signer, contractAddress])

  // Carga inicial de ordenes activas
  useEffect(() => {
    let mountedLock = true

    if (mountedLock) {
      cargarOrdenesActivas(ethers.constants.HashZero)
    }

    return () => {
      mountedLock = false
    }
  }, [cargarOrdenesActivas])

  // Carga inicial de tokens activos
  useEffect(() => {
    let mountedLock = true

    if (mountedLock) {
      cargarTokens(true)
    }

    return () => {
      mountedLock = false
    }
  }, [cargarTokens])

  //**************************************************************************//
  //                                                                          //
  //                       Return values and structures                       //
  //                                                                          //
  //**************************************************************************//
  const actions: BlockchainActions = {
    cargarOrdenesActivas,
    cargarOrdenesPropias,
    nuevaOrden,
    cancelarOrden,
    ejecutarOrden,
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
    conectarBilletera,
    cargarCuentasConectadas,
  } as BlockchainActions

  return (
    <BlockchainContext.Provider value={{ state, actions }}>
      {props.children}
    </BlockchainContext.Provider>
  )
}
