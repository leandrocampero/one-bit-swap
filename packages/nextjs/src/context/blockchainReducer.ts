import {
  AdministradoresState,
  BloqueadosState,
  OrdenesState,
  PlataformaState,
  ReducerAction,
  ReducerActionType,
  SesionState,
  TokensState,
  TransaccionState,
} from '@/context/context.d'
import { Orden } from '@/types'
import { ethers } from 'ethers'

//****************************************************************************//
//                                                                            //
//       ######                                                               //
//       #     #  #         ##    #####  ######   ####   #####   #    #       //
//       #     #  #        #  #     #    #       #    #  #    #  ##  ##       //
//       ######   #       #    #    #    #####   #    #  #    #  # ## #       //
//       #        #       ######    #    #       #    #  #####   #    #       //
//       #        #       #    #    #    #       #    #  #   #   #    #       //
//       #        ######  #    #    #    #        ####   #    #  #    #       //
//                                                                            //
//****************************************************************************//

export const plataformaReducer = (
  state: PlataformaState,
  action: ReducerAction
): PlataformaState => {
  switch (action.type) {
    case ReducerActionType.REINICIAR_ESTADO:
      return { ...(action.payload as PlataformaState) }

    case ReducerActionType.MARCAR_CARGANDO:
      return { ...state, cargando: true, error: null }

    case ReducerActionType.MARCAR_ERROR:
      return {
        ...state,
        cargando: false,
        error: action.payload,
      }

    case ReducerActionType.GUARDAR_DATOS:
      return {
        cargando: false,
        error: null,
        datos: { ...action.payload },
      }

    default:
      return state
  }
}

//****************************************************************************//
//                                                                            //
//              #######                                                       //
//              #     #  #####   #####   ######  #####    ####                //
//              #     #  #    #  #    #  #       #    #  #                    //
//              #     #  #    #  #    #  #####   #    #   ####                //
//              #     #  #####   #    #  #       #####        #               //
//              #     #  #   #   #    #  #       #   #   #    #               //
//              #######  #    #  #####   ######  #    #   ####                //
//                                                                            //
//****************************************************************************//

export const ordenesReducer = (
  state: OrdenesState,
  action: ReducerAction
): OrdenesState => {
  switch (action.type) {
    case ReducerActionType.REINICIAR_ESTADO:
      return { ...(action.payload as OrdenesState) }

    case ReducerActionType.MARCAR_CARGANDO:
      return { ...state, cargando: true, error: null }

    case ReducerActionType.MARCAR_ERROR:
      return {
        ...state,
        cargando: false,
        error: action.payload,
      }

    case ReducerActionType.GUARDAR_DATOS:
      const { ordenes, sobrescribir } = action.payload
      const datos = (ordenes as Array<Orden>).filter((ordenNueva) => {
        return (
          ordenNueva.idOrden !== ethers.constants.HashZero &&
          (sobrescribir ||
            state.datos.findIndex(
              (ordenGuardada) => ordenGuardada.idOrden === ordenNueva.idOrden
            ) === -1)
        )
      })

      return {
        cargando: false,
        error: null,
        datos: sobrescribir ? [...datos] : [...state.datos, ...datos],
      }

    default:
      return state
  }
}

//****************************************************************************//
//                                                                            //
//              #######                                                       //
//                 #      ####   #    #  ######  #    #   ####                //
//                 #     #    #  #   #   #       ##   #  #                    //
//                 #     #    #  ####    #####   # #  #   ####                //
//                 #     #    #  #  #    #       #  # #       #               //
//                 #     #    #  #   #   #       #   ##  #    #               //
//                 #      ####   #    #  ######  #    #   ####                //
//                                                                            //
//****************************************************************************//

export const tokensReducer = (
  state: TokensState,
  action: ReducerAction
): TokensState => {
  switch (action.type) {
    case ReducerActionType.REINICIAR_ESTADO:
      return { ...(action.payload as TokensState) }

    case ReducerActionType.MARCAR_CARGANDO:
      return { ...state, cargando: true, error: null }

    case ReducerActionType.MARCAR_ERROR:
      return {
        ...state,
        cargando: false,
        error: action.payload,
      }

    case ReducerActionType.GUARDAR_DATOS:
      return {
        cargando: false,
        error: null,
        datos: [...action.payload],
      }

    default:
      return state
  }
}

//****************************************************************************//
//                                                                            //
//                    #                                                       //
//                   # #    #####   #    #  #  #    #   ####                  //
//                  #   #   #    #  ##  ##  #  ##   #  #                      //
//                 #     #  #    #  # ## #  #  # #  #   ####                  //
//                 #######  #    #  #    #  #  #  # #       #                 //
//                 #     #  #    #  #    #  #  #   ##  #    #                 //
//                 #     #  #####   #    #  #  #    #   ####                  //
//                                                                            //
//****************************************************************************//

export const administradoresReducer = (
  state: AdministradoresState,
  action: ReducerAction
): AdministradoresState => {
  switch (action.type) {
    case ReducerActionType.REINICIAR_ESTADO:
      return { ...(action.payload as AdministradoresState) }

    case ReducerActionType.MARCAR_CARGANDO:
      return {
        ...state,
        cargando: true,
        error: null,
      }

    case ReducerActionType.MARCAR_ERROR:
      return {
        ...state,
        cargando: false,
        error: action.payload,
      }

    case ReducerActionType.GUARDAR_DATOS:
      return {
        cargando: false,
        error: null,
        datos: [...action.payload],
      }

    default:
      return state
  }
}

//****************************************************************************//
//                                                                            //
//          ######                                                            //
//          #     #  #        ####    ####   #    #  ######  #####            //
//          #     #  #       #    #  #    #  #   #   #       #    #           //
//          ######   #       #    #  #       ####    #####   #    #           //
//          #     #  #       #    #  #       #  #    #       #    #           //
//          #     #  #       #    #  #    #  #   #   #       #    #           //
//          ######   ######   ####    ####   #    #  ######  #####            //
//                                                                            //
//****************************************************************************//

export const bloqueadosReducer = (
  state: BloqueadosState,
  action: ReducerAction
): BloqueadosState => {
  switch (action.type) {
    case ReducerActionType.REINICIAR_ESTADO:
      return { ...(action.payload as BloqueadosState) }

    case ReducerActionType.MARCAR_CARGANDO:
      return { ...state, cargando: true, error: null }

    case ReducerActionType.MARCAR_ERROR:
      return {
        ...state,
        cargando: false,
        error: action.payload,
      }

    case ReducerActionType.GUARDAR_DATOS:
      return {
        cargando: false,
        error: null,
        datos: [...action.payload],
      }

    default:
      return state
  }
}

//****************************************************************************//
//                                                                            //
//                              #######                                       //
//                                 #     #    #                               //
//                                 #      #  #                                //
//                                 #       ##                                 //
//                                 #       ##                                 //
//                                 #      #  #                                //
//                                 #     #    #                               //
//                                                                            //
//****************************************************************************//

export const transaccionReducer = (
  state: TransaccionState,
  action: ReducerAction
): TransaccionState => {
  switch (action.type) {
    case ReducerActionType.REINICIAR_ESTADO:
      return { ...(action.payload as TransaccionState) }

    case ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO:
      return {
        cargando: true,
        error: null,
      }

    case ReducerActionType.MARCAR_TRANSACCION_REALIZADA:
      return {
        cargando: false,
        error: null,
      }

    case ReducerActionType.MARCAR_TRANSACCION_FALLIDA:
      return {
        cargando: false,
        error: action.payload,
      }

    default:
      return state
  }
}

//****************************************************************************//
//                                                                            //
//              #####                                                         //
//             #     #  ######   ####    ####   #   ####   #    #             //
//             #        #       #       #       #  #    #  ##   #             //
//              #####   #####    ####    ####   #  #    #  # #  #             //
//                   #  #            #       #  #  #    #  #  # #             //
//             #     #  #       #    #  #    #  #  #    #  #   ##             //
//              #####   ######   ####    ####   #   ####   #    #             //
//                                                                            //
//****************************************************************************//

export const sesionReducer = (
  state: SesionState,
  action: ReducerAction
): SesionState => {
  switch (action.type) {
    case ReducerActionType.REINICIAR_ESTADO:
      return { ...(action.payload as SesionState) }

    case ReducerActionType.MARCAR_CARGANDO:
      return { ...state, cargando: true, error: null }

    case ReducerActionType.MARCAR_ERROR:
      return {
        ...state,
        cargando: false,
        error: action.payload,
      }

    case ReducerActionType.GUARDAR_DATOS:
      return {
        cargando: false,
        error: null,
        datos: { ...action.payload },
      }

    default:
      return state
  }
}
