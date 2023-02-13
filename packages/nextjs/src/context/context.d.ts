import { Billetera, Orden, Plataforma, TiposOrdenes, Token } from '@/types'
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

export type BlockchainState = {
  plataforma: {
    datos: Plataforma
    cargando: boolean
    error: Error | null
  }
  ordenes: IExternalData<Orden>
  tokens: IExternalData<Token>
  administradores: IExternalData<Billetera>
  bloqueados: IExternalData<Billetera>
  transaccion: { cargando: boolean; error: Error | null }
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
  cargarTokens: (incluirSuspendidos: boolean) => Promise<void>
  nuevoToken: (contrato: string, oraculo: string) => Promise<void>
  activarToken: (ticker: string) => Promise<void>
  suspenderToken: (ticker: string) => Promise<void>
  modificarOraculoToken: (ticker: string, oraculo: string) => Promise<void>
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
  conectarBilletera: () => Promise<void>
  cargarCuentasConectadas: () => Promise<void>
}

//****************************************************************************//
//                                                                            //
//                          Blockchain Reducer Types                          //
//                                                                            //
//****************************************************************************//

export enum ReducerActionType {
  MARCAR_CARGANDO_ORDENES = 'MARCAR_CARGANDO_ORDENES',
  MARCAR_ERROR_ORDENES = 'MARCAR_ERROR_ORDENES',
  GUARDAR_ORDENES = 'GUARDAR_ORDENES',
  MARCAR_CARGANDO_TOKENS = 'MARCAR_CARGANDO_TOKENS',
  MARCAR_ERROR_TOKENS = 'MARCAR_ERROR_TOKENS',
  GUARDAR_TOKENS = 'GUARDAR_TOKENS',
  MARCAR_CARGANDO_PLATAFORMA = 'MARCAR_CARGANDO_PLATAFORMA',
  MARCAR_ERROR_PLATAFORMA = 'MARCAR_ERROR_PLATAFORMA',
  GUARDAR_DATOS_PLATAFORMA = 'GUARDAR_DATOS_PLATAFORMA',
  MARCAR_CARGANDO_ADMINISTRADORES = 'MARCAR_CARGANDO_ADMINISTRADORES',
  MARCAR_ERROR_ADMINISTRADORES = 'MARCAR_ERROR_ADMINISTRADORES',
  GUARDAR_ADMINISTRADORES = 'GUARDAR_ADMINISTRADORES',
  MARCAR_CARGANDO_BLOQUEADOS = 'MARCAR_CARGANDO_BLOQUEADOS',
  MARCAR_ERROR_BLOQUEADOS = 'MARCAR_ERROR_BLOQUEADOS',
  GUARDAR_BILLETERAS_BLOQUEADAS = 'GUARDAR_BILLETERAS_BLOQUEADOS',
  REINICIAR_ESTADO = 'REINICIAR_ESTADO',
  MARCAR_TRANSACCION_EN_PROGRESO = 'MARCAR_TRANSACCION_EN_PROGRESO',
  MARCAR_TRANSACCION_REALIZADA = 'MARCAR_TRANSACCION_REALIZADA',
  MARCAR_TRANSACCION_FALLIDA = 'MARCAR_TRANSACCION_FALLIDA',
}

export type ReducerAction = { type: ReducerActionType; payload?: any }
