export enum Estados {
  activo = 0,
  suspendido = 1,
}

export enum EstadosOrdenes {
  activa = 0,
  cancelada = 2,
  finalizada = 3,
}

export enum TiposOrdenes {
  compraVenta = 0,
  intercambio = 1,
  todas = 2,
}

export enum RolesBilleteras {
  usuario = 1,
  administrador = 2,
  propietario = 3,
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
  ordenesAbiertas = 'Ordenes Abiertas',
  misOrdenes = 'Mis Ordenes',
  miHistorial = 'Historial',
  billeteras = 'Billeteras',
  tokens = 'Tokens',
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
  id = 'Id',
  tipo = 'Tipo',
  cantidadVenta = 'CantidadVenta',
  tokenVenta = 'TokenVenta',
  cantidadCompra = 'CantidadCompra',
  tokenCompra = 'TokenCompra',
  fechaCreacion = 'FechaCreacion',
  boton = 'Boton',
  // tokens
  ticker = 'Ticker',
  simbolo = 'Simbolo',
  contrato = 'Contrato',
  // billeteras
  rol = 'Rol',
  billetera = 'Billetera',
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
