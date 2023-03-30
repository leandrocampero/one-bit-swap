import React from 'react'

export enum Estados {
  activo = 0,
  suspendido = 1,
  todos = 2,
}

export enum EstadosOrdenes {
  activa = 0,
  cancelada = 1,
  finalizada = 2,
  todas = 3,
}

export enum TiposOrdenes {
  compraVenta = 0,
  intercambio = 1,
  todas = 2,
}

export enum RolesBilleteras {
  usuario = 0,
  administrador = 1,
  propietario = 2,
}

/**
 * enum tulizado para dar nombre y id a las NavTabs que permiten al cliente
 * desplazarce entre las listas de:
 * @enum
 * @ordenesAbiertas
 * @misOrdenes
 * @miHistorial
 */
export enum NavMenu {
  configuracion = 'Configuración',
  administradores = 'Administradores',
  tokens = 'Tokens',
  billeterasSuspendidas = 'Billeteras Suspendidas',
}

export enum Acciones {
  activar = 'Activar',
  desactivar = 'Desactivar',
  modificar = 'Modificar',
  admin = 'Admin',
  superadmin = 'Superadmin',
  detalles = 'Detalles',
  cancelar = 'Cancelar',
}

export enum TipoColumna {
  // ordenes
  id = 'id',
  tipo = 'Tipo',
  cantidadVenta = 'Cantidad de Venta',
  tokenVenta = 'Venta',
  cantidadCompra = 'Cantidad de Compra',
  tokenCompra = 'Compra',
  fechaCreacion = 'Fecha de Creacion',
  boton = 'Boton',
  // tokens
  ticker = 'Ticker',
  simbolo = 'Simbolo',
  contrato = 'Contrato',
  // billeteras
  rol = 'Rol',
  direccion = 'Direccion',
  // comunes
  estado = 'Estado',
  acciones = 'Acciones',
}

export interface Columna {
  id: TipoColumna
  label: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
}

export declare global {
  interface Window {
    ethereum: any
  }
}

export interface Session {
  chainId: number
  address: string
  date: number
}

/******************************************************************************/

export type AppProps = {
  children: React.ReactNode
}

export type Orden = {
  idOrden: string
  vendedor: string
  comprador: string
  montoVenta: string
  montoCompra: string
  fechaCreacion: string
  fechaFinalizacion: string
  tokenCompra: string
  tokenVenta: string
  estado: EstadosOrdenes
  tipo: TiposOrdenes
}

export type Token = {
  ticker: string
  contrato: string
  oraculo: string | undefined
  decimales: number
  estado: Estados
  existe: boolean
}

export type Billetera = {
  direccion: string
  rol: RolesBilleteras
  estado: Estados
}

export type Plataforma = {
  contrato: string
  estado: Estados
  montoMinimo: number
}
