import {
  ERROR_ARGUMENTOS_INVALIDOS,
  ERROR_DESCONOCIDO,
  ERROR_ESTADO_GENERAL_INVALIDO,
  ERROR_ESTADO_ORDEN_INVALIDO,
  ERROR_ROL_BILLETERA_INVALIDO,
  ERROR_TIPO_ORDEN_INVALIDO,
  ERROR_TX_FALLIDA,
  ERROR_TX_RECHAZADA,
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
  return listado.map(
    ({ ticker, contrato, oraculo, decimales, estado }) =>
      ({
        ticker,
        contrato,
        oraculo,
        decimales,
        estado: getEstadoGeneral(estado),
      } as Token)
  )
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

  let time: number

  if (diff < minute) {
    time = Math.floor(diff / 1000)
    return `${time} ${time === 1 ? 'segundo' : 'segundos'}`
  } else if (diff < hour) {
    time = Math.floor(diff / minute)
    return `${time} ${time === 1 ? 'minuto' : 'minutos'}`
  } else if (diff < day) {
    time = Math.floor(diff / hour)
    return `${time} ${time === 1 ? 'hora' : 'horas'}`
  } else if (diff < week) {
    time = Math.floor(diff / day)
    return `${time} ${time === 1 ? 'día' : 'días'}`
  } else if (diff < month) {
    time = Math.floor(diff / week)
    return `${time} ${time === 1 ? 'semana' : 'semanas'}`
  } else if (diff < year) {
    time = Math.floor(diff / month)
    return `${time} ${time === 1 ? 'mes' : 'meses'}`
  } else {
    time = Math.floor(diff / year)
    return `${time} ${time === 1 ? 'año' : 'años'}`
  }
}

export function formatErrorMessage(errorRaw: string): string {
  if (/ACTION_REJECTED/.test(errorRaw)) {
    return ERROR_TX_RECHAZADA
  }

  if (/INVALID_ARGUMENT/.test(errorRaw)) {
    return ERROR_ARGUMENTOS_INVALIDOS
  }

  if (/UNSUPPORTED_OPERATION/.test(errorRaw)) {
    return ERROR_DESCONOCIDO
  }

  if (/UNSUPPORTED_OPERATION/.test(errorRaw)) {
    return ERROR_DESCONOCIDO
  }

  if (/(32000|Nonce too high)/.test(errorRaw)) {
    return ERROR_TX_FALLIDA
  }

  const indexStart = errorRaw.indexOf("'")

  if (indexStart === -1) return errorRaw

  const indexEnd = errorRaw.indexOf("'", indexStart + 1)
  const error = errorRaw.slice(indexStart + 1, indexEnd)

  return error
}
