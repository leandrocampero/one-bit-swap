import { ethers } from 'ethers'
import { Datos } from '../../../hardhat/typechain-types/contracts/Datos'

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
      fechaCreacion,
      fechaFinalizacion,
      estado,
      tipo,
      existe,
      tokenCompra,
      tokenVenta,
    })
  )
}

export function showConsoleTable(ordenes: any[]) {
  const result = ordenes.map(
    ({
      idOrden,
      vendedor,
      comprador,
      montoVenta,
      montoCompra,
      fechaCreacion,
      fechaFinalizacion,
      tipo,
      tokenCompra,
      tokenVenta,
    }) => {
      const montoCompraParsed = ethers.utils.formatEther(montoCompra.toString())
      const montoCompraFormated =
        montoCompraParsed.split('.')[1].length > 6
          ? parseFloat(montoCompraParsed).toFixed(6)
          : montoCompraParsed

      return {
        idOrden: simpleAddress(idOrden),
        vendedor: simpleAddress(vendedor),
        comprador:
          comprador == ethers.constants.AddressZero
            ? '-'
            : simpleAddress(comprador),
        tokenVenta,
        montoVenta: ethers.utils.formatEther(montoVenta.toString()),
        tokenCompra,
        montoCompra: montoCompraFormated,
        fechaCreacion: new Date(
          fechaCreacion.toNumber() * 1000
        ).toLocaleString(),
        fechaFinalizacion: fechaFinalizacion.eq(0)
          ? '-'
          : new Date(fechaFinalizacion.toNumber() * 1000).toLocaleString(),
        tipo: tipo == 0 ? 'Compra-Venta' : 'Intercambio',
      }
    }
  )

  console.table(result)
}

function simpleAddress(address: string): string {
  const first6char = address.slice(0, 6)
  const last4char = address.slice(-4)
  return `${first6char}..${last4char}`
}
