import {
  Billetera,
  Estados,
  Orden,
  Plataforma,
  RolesBilleteras,
  TiposOrdenes,
  Token,
} from '@/types.d'
import { JsonRpcSigner } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

//****************************************************************************//
//                                                                            //
//                                 Interfaces                                 //
//                                                                            //
//****************************************************************************//

export interface IExternalData<T> {
  datos: Array<T>
  cargando: boolean
  error: Error | null
}

//****************************************************************************//
//                                                                            //
//                                   Types                                    //
//                                                                            //
//****************************************************************************//

export type Filtros = {
  tokenCompra?: string
  tokenVenta?: string
  montoMaximoCompra?: bigint | BigNumber
  montoMaximoVenta?: bigint | BigNumber
  tipoOrden?: TiposOrdenes
}

//****************************************************************************//
//                                                                            //
//                              Blockchain State                              //
//                                                                            //
//****************************************************************************//

export type PlataformaState = {
  datos: Plataforma
  cargando: boolean
  error: Error | null
}
export type OrdenesState = IExternalData<Orden>
export type TokensState = IExternalData<Token>
export type AdministradoresState = IExternalData<Billetera>
export type BloqueadosState = IExternalData<Billetera>
export type TransaccionState = { cargando: boolean; error: string | null }
export type SesionState = {
  datos: Billetera
  cargando: boolean
  error: string | null
}

export const PLATAFORMA_INITIAL_STATE: PlataformaState = {
  datos: { contrato: '', montoMinimo: 0, estado: Estados.activo },
  cargando: false,
  error: null,
}

export const DATOS_INITIAL_STATE = {
  datos: [],
  cargando: false,
  error: null,
}

export const TRANSACCION_INITIAL_STATE: TransaccionState = {
  cargando: false,
  error: null,
}

export const SESION_INITIAL_STATE: SesionState = {
  cargando: false,
  error: null,
  datos: {
    direccion: '',
    estado: Estados.activo,
    rol: RolesBilleteras.usuario,
  },
}

//****************************************************************************//
//                                                                            //
//                             Blockchain Actions                             //
//                                                                            //
//****************************************************************************//

export type BlockchainActions = {
  cargarOrdenesActivas: (idOrdenBase: string) => Promise<void>
  cargarOrdenesPropias: () => Promise<void>
  filtrarOrdenes: (filtros: { [string as key]: boolean }) => Promise<void>
  nuevaOrden: (
    tokenCompra: string,
    tokenVenta: string,
    montoCompra: string,
    montoVenta: string,
    tipo: TiposOrdenes
  ) => Promise<void>
  cancelarOrden: (idOrden: string) => Promise<void>
  ejecutarOrden: (idOrden: string) => Promise<void>
  buscarOrdenEspejo: (
    tokenCompra: string,
    tokenVenta: string,
    montoCompra: string,
    montoVenta: string
  ) => Promise<Orden | null>
  cargarTokens: (incluirSuspendidos: boolean) => Promise<void>
  nuevoToken: (contrato: string, oraculo: string) => Promise<void>
  activarToken: (ticker: string) => Promise<void>
  suspenderToken: (ticker: string) => Promise<void>
  modificarOraculoToken: (ticker: string, oraculo: string) => Promise<void>
  consultarCotizacion: (
    tokenVenta: string,
    tokenCompra: string,
    montoVenta: string
  ) => Promise<string | null>
  cargarDatosPlataforma: () => Promise<void>
  bloquearPlataforma: () => Promise<void>
  desbloquearPlataforma: () => Promise<void>
  cambiarMontoMinimoPlataforma: (monto: string) => Promise<void>
  cargarAdministradores: () => Promise<void>
  nuevoAdministrador: (billetera: string) => Promise<void>
  quitarAdministrador: (billetera: string) => Promise<void>
  cargarBloqueados: () => Promise<void>
  bloquearBilletera: (billetera: string) => Promise<void>
  desbloquearBilletera: (billetera: string) => Promise<void>
  autenticarBilletera: (signer: JsonRpcSigner) => Promise<void>
  borrarSesion: () => void
}

//****************************************************************************//
//                                                                            //
//                             Blockchain Getters                             //
//                                                                            //
//****************************************************************************//

export type BlockchainGetters = {
  plataforma: PlataformaState
  ordenes: OrdenesState
  tokens: TokensState
  administradores: AdministradoresState
  bloqueados: BloqueadosState
  transaccion: TransaccionState
  sesion: SesionState
}

//****************************************************************************//
//                                                                            //
//                          Blockchain Reducer Types                          //
//                                                                            //
//****************************************************************************//

export enum ReducerActionType {
  REINICIAR_ESTADO = 'REINICIAR_ESTADO',
  MARCAR_CARGANDO = 'MARCAR_CARGANDO',
  MARCAR_ERROR = 'MARCAR_ERROR',
  GUARDAR_DATOS = 'GUARDAR_DATOS',
  MARCAR_TRANSACCION_EN_PROGRESO = 'MARCAR_TRANSACCION_EN_PROGRESO',
  MARCAR_TRANSACCION_REALIZADA = 'MARCAR_TRANSACCION_REALIZADA',
  MARCAR_TRANSACCION_FALLIDA = 'MARCAR_TRANSACCION_FALLIDA',
}

export type ReducerAction = { type: ReducerActionType; payload?: any }
