import { Datos } from '../typechain-types/contracts/Datos'

export function formatArrayBilleteras(
  listado: Datos.BilleteraStructOutput[]
): Datos.BilleteraStruct[] {
  return listado.map(
    ({ direccion, estado, existe, indiceAdmin, indiceBloqueado, rol }) => ({
      direccion,
      estado,
      rol,
      existe,
      indiceAdmin: indiceAdmin.toString(),
      indiceBloqueado: indiceBloqueado.toString(),
    })
  ) as Datos.BilleteraStruct[]
}

export function formatArrayTokens(
  listado: Datos.TokenStructOutput[]
): Datos.TokenStruct[] {
  return listado.map(
    ({ ticker, contrato, oraculo, decimales, estado, existe }) => ({
      ticker,
      contrato,
      oraculo,
      decimales,
      estado,
      existe,
    })
  )
}

export function formatArrayOrdenes(
  listado: Datos.OrdenStructOutput[]
): Datos.OrdenStruct[] {
  return listado.map(
    ({
      idOrden,
      siguienteOrdenActiva,
      anteriorOrdenActiva,
      siguienteOrdenGemela,
      anteriorOrdenGemela,
      vendedor,
      comprador,
      montoVenta,
      montoCompra,
      fechaCreacion,
      fechaFinalizacion,
      estado,
      tipo,
      existe,
      tokenCompra,
      tokenVenta,
    }) => ({
      idOrden,
      siguienteOrdenActiva,
      anteriorOrdenActiva,
      siguienteOrdenGemela,
      anteriorOrdenGemela,
      vendedor,
      comprador,
      montoVenta: montoVenta.toString(),
      montoCompra: montoCompra.toString(),
      fechaCreacion: new Date(fechaCreacion.toNumber() * 1000).toLocaleString(),
      fechaFinalizacion: fechaFinalizacion.eq(0)
        ? '-'
        : new Date(fechaFinalizacion.toNumber() * 1000).toLocaleString(),
      estado,
      tipo,
      existe,
      tokenCompra,
      tokenVenta,
    })
  )
}
