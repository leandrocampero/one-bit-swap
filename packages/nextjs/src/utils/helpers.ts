import {
  ERROR_ESTADO_GENERAL_INVALIDO,
  ERROR_ESTADO_ORDEN_INVALIDO,
  ERROR_ROL_BILLETERA_INVALIDO,
  ERROR_TIPO_ORDEN_INVALIDO,
} from '@/constants/mensajes'
import {
  Billetera,
  Estados,
  EstadosOrdenes,
  Orden,
  RolesBilleteras,
  TiposOrdenes,
  Token,
} from '@/types.d'
import { Datos } from '@one-bit-swap/hardhat/typechain-types/contracts/Datos'
import { ethers } from 'ethers'

const OFFSET = 10 * 60

export function formatArrayBilleteras(
  listado: Datos.BilleteraStructOutput[]
): Billetera[] {
  return listado.map(({ direccion, estado, rol }) => ({
    direccion,
    estado: getEstadoGeneral(estado),
    rol: getRolBilletera(rol),
  }))
}

export function formatBilletera(
  billetera: Datos.BilleteraStructOutput
): Billetera {
  const { direccion, estado, rol } = billetera
  return {
    direccion,
    estado: getEstadoGeneral(estado),
    rol: getRolBilletera(rol),
  }
}

export function formatArrayTokens(listado: Datos.TokenStructOutput[]): Token[] {
  return listado.map(({ ticker, contrato, oraculo, decimales, estado }) => ({
    ticker,
    contrato,
    oraculo,
    decimales,
    estado: getEstadoGeneral(estado),
  }))
}

export function formatArrayOrdenes(
  listado: Datos.OrdenStructOutput[]
): Orden[] {
  return listado
    .filter(({ idOrden }) => idOrden !== ethers.constants.HashZero)
    .map(
      ({
        idOrden,
        vendedor,
        comprador,
        montoVenta,
        montoCompra,
        fechaCreacion,
        fechaFinalizacion,
        estado,
        tipo,
        tokenCompra,
        tokenVenta,
      }) => ({
        idOrden,
        vendedor,
        comprador,
        montoVenta: montoVenta.toString(),
        montoCompra: montoCompra.toString(),
        fechaCreacion: fechaCreacion.sub(OFFSET).toString(),
        fechaFinalizacion: fechaFinalizacion.sub(OFFSET).toString(),
        tokenCompra,
        tokenVenta,
        estado: getEstadoOrden(estado),
        tipo: getTipoOrden(tipo),
      })
    )
}

export function formatOrden(orden: Datos.OrdenStructOutput): Orden {
  const {
    idOrden,
    vendedor,
    comprador,
    montoVenta,
    montoCompra,
    fechaCreacion,
    fechaFinalizacion,
    estado,
    tipo,
    tokenCompra,
    tokenVenta,
  } = orden

  return {
    idOrden,
    vendedor,
    comprador,
    montoVenta: montoVenta.toString(),
    montoCompra: montoCompra.toString(),
    fechaCreacion: fechaCreacion.toString(),
    fechaFinalizacion: fechaFinalizacion.toString(),
    tokenCompra,
    tokenVenta,
    estado: getEstadoOrden(estado),
    tipo: getTipoOrden(tipo),
  }
}

export function getTipoOrden(number: number): TiposOrdenes {
  switch (number) {
    case TiposOrdenes.compraVenta: {
      return TiposOrdenes.compraVenta
    }
    case TiposOrdenes.intercambio: {
      return TiposOrdenes.intercambio
    }
    default: {
      throw Error(ERROR_TIPO_ORDEN_INVALIDO)
    }
  }
}

export function getEstadoOrden(number: number): EstadosOrdenes {
  switch (number) {
    case EstadosOrdenes.activa: {
      return EstadosOrdenes.activa
    }
    case EstadosOrdenes.cancelada: {
      return EstadosOrdenes.cancelada
    }
    case EstadosOrdenes.finalizada: {
      return EstadosOrdenes.finalizada
    }
    default: {
      throw Error(ERROR_ESTADO_ORDEN_INVALIDO)
    }
  }
}

export function getEstadoGeneral(number: number): Estados {
  switch (number) {
    case Estados.activo: {
      return Estados.activo
    }
    case Estados.suspendido: {
      return Estados.suspendido
    }
    default: {
      throw Error(ERROR_ESTADO_GENERAL_INVALIDO)
    }
  }
}

export function getRolBilletera(number: number): RolesBilleteras {
  switch (number) {
    case RolesBilleteras.administrador: {
      return RolesBilleteras.administrador
    }
    case RolesBilleteras.propietario: {
      return RolesBilleteras.propietario
    }
    case RolesBilleteras.usuario: {
      return RolesBilleteras.usuario
    }
    default: {
      throw Error(ERROR_ROL_BILLETERA_INVALIDO)
    }
  }
}

export function simpleAddress(address: string): string {
  const first6char = address.slice(0, 6)
  const last4char = address.slice(-4)
  return `${first6char}..${last4char}`
}

export async function sleep() {
  if (process.env.NODE_ENV === 'development') {
    const sleep = new Promise((resolve) => setTimeout(resolve, 1000))
    await sleep
  }
}

export function getTimeAgoString(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return Math.floor(diff / 1000) + ' segundos'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + ' minutos'
  } else if (diff < day) {
    return Math.floor(diff / hour) + ' horas'
  } else if (diff < week) {
    return Math.floor(diff / day) + ' días'
  } else if (diff < month) {
    return Math.floor(diff / week) + ' semanas'
  } else if (diff < year) {
    return Math.floor(diff / month) + ' meses'
  } else {
    return Math.floor(diff / year) + ' años'
  }
}
