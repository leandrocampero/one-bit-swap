import {
  BlockchainState,
  ReducerAction,
  ReducerActionType,
} from '@/context/context.d'
import { Orden } from '@/types'
import { ethers } from 'ethers'

export const blockchainReducer = (
  state: BlockchainState,
  action: ReducerAction
): BlockchainState => {
  switch (action.type) {
    case ReducerActionType.REINICIAR_ESTADO:
      return { ...(action.payload as BlockchainState) }

    case ReducerActionType.MARCAR_CARGANDO_ORDENES:
      return {
        ...state,
        ordenes: { ...state.ordenes, cargando: true, error: null },
      }

    case ReducerActionType.MARCAR_ERROR_ORDENES:
      return {
        ...state,
        ordenes: {
          ...state.ordenes,
          cargando: false,
          error: action.payload,
        },
      }

    case ReducerActionType.GUARDAR_ORDENES:
      const { ordenes, sobrescribir } = action.payload
      const datos = (ordenes as Array<Orden>).filter((ordenNueva) => {
        return (
          ordenNueva.idOrden !== ethers.constants.HashZero &&
          state.ordenes.datos.findIndex(
            (ordenGuardada) => ordenGuardada.idOrden === ordenNueva.idOrden
          ) === -1
        )
      })
      return {
        ...state,
        ordenes: {
          ...state.ordenes,
          cargando: false,
          error: null,
          datos: sobrescribir ? [...datos] : [...state.ordenes.datos, ...datos],
        },
      }

    case ReducerActionType.MARCAR_CARGANDO_TOKENS:
      return {
        ...state,
        tokens: { ...state.tokens, cargando: true, error: null },
      }

    case ReducerActionType.MARCAR_ERROR_TOKENS:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          cargando: false,
          error: action.payload,
        },
      }

    case ReducerActionType.GUARDAR_TOKENS:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          cargando: false,
          error: null,
          datos: [...action.payload],
        },
      }

    case ReducerActionType.MARCAR_CARGANDO_PLATAFORMA:
      return {
        ...state,
        plataforma: { ...state.plataforma, cargando: true, error: null },
      }

    case ReducerActionType.MARCAR_ERROR_PLATAFORMA:
      return {
        ...state,
        plataforma: {
          ...state.plataforma,
          cargando: false,
          error: action.payload,
        },
      }

    case ReducerActionType.GUARDAR_DATOS_PLATAFORMA:
      return {
        ...state,
        plataforma: {
          ...state.plataforma,
          cargando: false,
          error: null,
          datos: { ...action.payload },
        },
      }

    case ReducerActionType.MARCAR_CARGANDO_ADMINISTRADORES:
      return {
        ...state,
        administradores: {
          ...state.administradores,
          cargando: true,
          error: null,
        },
      }

    case ReducerActionType.MARCAR_ERROR_ADMINISTRADORES:
      return {
        ...state,
        administradores: {
          ...state.administradores,
          cargando: false,
          error: action.payload,
        },
      }

    case ReducerActionType.GUARDAR_ADMINISTRADORES:
      return {
        ...state,
        administradores: {
          ...state.administradores,
          cargando: false,
          error: null,
          datos: [...action.payload],
        },
      }

    case ReducerActionType.MARCAR_CARGANDO_BLOQUEADOS:
      return {
        ...state,
        bloqueados: { ...state.bloqueados, cargando: true, error: null },
      }

    case ReducerActionType.MARCAR_ERROR_BLOQUEADOS:
      return {
        ...state,
        bloqueados: {
          ...state.bloqueados,
          cargando: false,
          error: action.payload,
        },
      }

    case ReducerActionType.GUARDAR_BILLETERAS_BLOQUEADAS:
      return {
        ...state,
        bloqueados: {
          ...state.bloqueados,
          cargando: false,
          error: null,
          datos: [...action.payload],
        },
      }

    case ReducerActionType.MARCAR_TRANSACCION_EN_PROGRESO:
      return {
        ...state,
        transaccion: {
          cargando: true,
          error: null,
        },
      }

    case ReducerActionType.MARCAR_TRANSACCION_REALIZADA:
      return {
        ...state,
        transaccion: {
          cargando: false,
          error: null,
        },
      }

    case ReducerActionType.MARCAR_TRANSACCION_FALLIDA:
      return {
        ...state,
        transaccion: {
          cargando: false,
          error: action.payload,
        },
      }

    case ReducerActionType.MARCAR_CARGANDO_SESION:
      return {
        ...state,
        sesion: { ...state.sesion, cargando: true, error: null },
      }

    case ReducerActionType.MARCAR_ERROR_SESION:
      return {
        ...state,
        sesion: {
          ...state.sesion,
          cargando: false,
          error: action.payload,
        },
      }

    case ReducerActionType.GUARDAR_DATOS_SESION:
      return {
        ...state,
        sesion: {
          cargando: false,
          error: null,
          datos: { ...action.payload },
        },
      }

    default:
      return state
  }
}
