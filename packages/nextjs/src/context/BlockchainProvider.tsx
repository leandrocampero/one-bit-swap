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
  ERROR_NO_CONTRACT_ADDRESS,
  ERROR_NO_FAUCET_ADDRESS,
  ERROR_NO_SIGNER,
  ERROR_NO_TOKEN_ADDRESS,
} from '@/constants/mensajes'
import {
  administradoresReducer,
  ordenesReducer,
  plataformaReducer,
  sesionReducer,
  suspendidosReducer,
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
import ERC20 from '@/contracts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import ERC20Mock from '@/contracts/contracts/ERC20Mock.sol/ERC20Mock.json'
import Plataforma from '@/contracts/contracts/Plataforma.sol/Plataforma.json'
import deploy from '@/contracts/deploy.json'
import { AppProps, Orden, TiposOrdenes } from '@/types.d'
import {
  formatArrayBilleteras,
  formatArrayOrdenes,
  formatBilletera,
  formatErrorMessage,
  formatOrden,
  sleep,
} from '@/utils/helpers'
import { JsonRpcSigner } from '@ethersproject/providers'
import {
  ERC20Mock as ContratoFaucet,
  Plataforma as ContratoPlataforma,
  ERC20 as ContratoToken,
} from '@one-bit-swap/hardhat/typechain-types/'
import { BigNumber, ethers } from 'ethers'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { useAlertContext } from './AlertProvider'

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
const FAUCET_AMOUNT = '1000'

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

  const [suspendidos, reduceSuspendidos] = useReducer(
    suspendidosReducer,
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
  const { newAlert } = useAlertContext()

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

  const setupFaucet = useCallback(
    (contractAddress: string): ContratoFaucet => {
      if (!signer) {
        throw new Error(ERROR_NO_SIGNER)
      }

      if (!contractAddress) {
        throw new Error(ERROR_NO_FAUCET_ADDRESS)
      }

      const contrato = new ethers.Contract(
        contractAddress,
        ERC20Mock,
        signer
      ) as ContratoFaucet

      return contrato
    },
    [signer]
  )

  const setupTokenContract = useCallback(
    (contractAddress: string): ContratoToken => {
      if (!signer) {
        throw new Error(ERROR_NO_SIGNER)
      }

      if (!contractAddress) {
        throw new Error(ERROR_NO_TOKEN_ADDRESS)
      }

      const contrato = new ethers.Contract(
        contractAddress,
        ERC20,
        signer
      ) as ContratoToken

      return contrato
    },
    [signer]
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
        newAlert('error', formatErrorMessage(error.message))

        reduceOrdenes({
          type: ReducerActionType.MARCAR_ERROR,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
      newAlert('error', formatErrorMessage(error.message))

      reduceOrdenes({
        type: ReducerActionType.MARCAR_ERROR,
        payload: formatErrorMessage(error.message),
      })
    }
  }, [setupContract, newAlert])

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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
        newAlert('error', formatErrorMessage(error.message))

        reduceTokens({
          type: ReducerActionType.MARCAR_ERROR,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
  )

  const consultarCotizacion = useCallback(
    async (
      tokenVenta: string,
      tokenCompra: string,
      montoVenta: string
    ): Promise<string | null> => {
      try {
        const contract = setupContract()
        const resultado = await contract.consultarMontoCotizado(
          tokenVenta,
          tokenCompra,
          montoVenta
        )

        return resultado.toString()
      } catch (error: any) {
        return null
      }
    },
    [setupContract]
  )

  const emitirTokens = useCallback(
    async (contratoToken: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const faucet = setupFaucet(contratoToken)
        const receipt = await faucet.mint(
          sesion.datos.direccion,
          ethers.utils.parseUnits(FAUCET_AMOUNT).toString()
        )
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupFaucet, newAlert, sesion.datos.direccion]
  )

  const aprobarDeposito = useCallback(
    async (contratoToken: string) => {
      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO,
      })
      await sleep()

      try {
        const faucet = setupTokenContract(contratoToken)
        const receipt = await faucet.approve(
          contractAddress,
          ethers.utils.parseUnits(FAUCET_AMOUNT)
        )
        await receipt.wait()

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_REALIZADA,
        })
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupTokenContract, contractAddress, newAlert]
  )

  const consultarCredito = useCallback(
    async (contratoToken: string): Promise<BigNumber> => {
      try {
        const contract = setupTokenContract(contratoToken)
        const credito = await contract.allowance(
          sesion.datos.direccion,
          contractAddress
        )

        return credito
      } catch (error: any) {
        return BigNumber.from('0')
      }
    },
    [setupTokenContract, contractAddress, sesion.datos.direccion]
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
      newAlert('error', formatErrorMessage(error.message))

      reducePlataforma({
        type: ReducerActionType.MARCAR_ERROR,
        payload: formatErrorMessage(error.message),
      })
    }
  }, [setupContract, newAlert])

  const suspenderPlataforma = useCallback(async () => {
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
      newAlert('success', 'Operación exitosa')
    } catch (error: any) {
      newAlert('error', formatErrorMessage(error.message))

      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
        payload: formatErrorMessage(error.message),
      })
    }
  }, [setupContract, newAlert])

  const activarPlataforma = useCallback(async () => {
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
      newAlert('success', 'Operación exitosa')
    } catch (error: any) {
      newAlert('error', formatErrorMessage(error.message))

      reduceTransaccion({
        type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
        payload: formatErrorMessage(error.message),
      })
    }
  }, [setupContract, newAlert])

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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
      newAlert('error', formatErrorMessage(error.message))

      reduceAdministradores({
        type: ReducerActionType.MARCAR_ERROR,
        payload: formatErrorMessage(error.message),
      })
    }
  }, [setupContract, newAlert])

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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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

  const cargarSuspendidos = useCallback(async () => {
    reduceSuspendidos({ type: ReducerActionType.MARCAR_CARGANDO })
    await sleep()

    try {
      const contract = setupContract()
      const resultado = formatArrayBilleteras(
        await contract.listarBilleterasBloqueadas()
      )

      reduceSuspendidos({
        type: ReducerActionType.GUARDAR_DATOS,
        payload: resultado,
      })
    } catch (error: any) {
      newAlert('error', formatErrorMessage(error.message))

      reduceSuspendidos({
        type: ReducerActionType.MARCAR_ERROR,
        payload: formatErrorMessage(error.message),
      })
    }
  }, [setupContract, newAlert])

  const suspenderBilletera = useCallback(
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
  )

  const activarBilletera = useCallback(
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
        newAlert('success', 'Operación exitosa')
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceTransaccion({
          type: ReducerActionType.MARCAR_TRANSACCION_FALLIDA,
          payload: formatErrorMessage(error.message),
        })
      }
    },
    [setupContract, newAlert]
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

        // if (estado === Estados.suspendido) {
        //   throw new Error(ERROR_BILLETERA_SUSPENDIDA)
        // }

        reduceSesion({
          type: ReducerActionType.GUARDAR_DATOS,
          payload: { direccion, estado, rol },
        })
      } catch (error: any) {
        newAlert('error', formatErrorMessage(error.message))

        reduceSesion({
          type: ReducerActionType.MARCAR_ERROR,
          payload: formatErrorMessage(error.message),
        })
        throw new Error(ERROR_AUTENTICAR_BILLETERA)
      }
    },
    [setupContract, newAlert]
  )

  const borrarSesion = useCallback(() => {
    reduceSesion({ type: ReducerActionType.MARCAR_CARGANDO })

    reduceSesion({
      type: ReducerActionType.REINICIAR_ESTADO,
      payload: SESION_INITIAL_STATE,
    })
  }, [])

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
  const getSuspendidos = useMemo(() => suspendidos, [suspendidos])
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
    suspenderPlataforma,
    activarPlataforma,
    cambiarMontoMinimoPlataforma,
    cargarAdministradores,
    nuevoAdministrador,
    quitarAdministrador,
    cargarSuspendidos: cargarSuspendidos,
    suspenderBilletera,
    activarBilletera,
    autenticarBilletera,
    borrarSesion,
    consultarCotizacion,
    emitirTokens,
    aprobarDeposito,
    consultarCredito,
  } as BlockchainActions

  const getters: BlockchainGetters = {
    plataforma: getPlataforma,
    ordenes: getOrdenes,
    tokens: getTokens,
    administradores: getAdministradores,
    suspendidos: getSuspendidos,
    transaccion: getTransaccion,
    sesion: getSesion,
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
