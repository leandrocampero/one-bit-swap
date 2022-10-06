import { EstadosOrdenes, TiposOrdenes } from '../types'
import Billeteras from './Billeteras'
import Tokens from './Tokens'

export default class Ordenes {
  private _idOrden: string
  private _vendedor: Billeteras
  private _comprador: Billeteras
  private _tokenVenta: Tokens
  private _tokenCompra: Tokens
  private _montoVenta: bigint
  private _montoCompra: bigint
  private _fechaCreacion: Date
  private _fechaEjecucion: Date | undefined
  private _fechaCaducidad: Date
  private _montoVentaUSD: number
  private _montoCompraUSD: number
  private _estado: EstadosOrdenes
  private _tipo: TiposOrdenes

  constructor(
    idOrden: string,
    vendedor: Billeteras,
    comprador: Billeteras,
    tokenVenta: Tokens,
    tokenCompra: Tokens,
    montoVenta: bigint,
    montoCompra: bigint,
    fechaCreacion: Date,
    montoVentaUSD: number,
    montoCompraUSD: number,
    tipo: TiposOrdenes
  ) {
    this._idOrden = idOrden
    this._vendedor = vendedor
    this._comprador = comprador
    this._tokenVenta = tokenVenta
    this._tokenCompra = tokenCompra
    this._montoVenta = montoVenta
    this._montoCompra = montoCompra
    this._fechaCreacion = fechaCreacion
    this._fechaCaducidad = new Date(fechaCreacion.getDate() + 2)
    this._montoVentaUSD = montoVentaUSD
    this._montoCompraUSD = montoCompraUSD
    this._estado = EstadosOrdenes.activa
    this._tipo = tipo
  }

  public ejecutar(comprador: Billeteras) {
    this._comprador = comprador
    this._estado = EstadosOrdenes.finalizada
  }

  public cancelar() {
    this._estado = EstadosOrdenes.cancelada
  }

  public get idOrden(): string {
    return this._idOrden
  }

  public set idOrden(value: string) {
    this._idOrden = value
  }

  public get vendedor(): Billeteras {
    return this._vendedor
  }

  public set vendedor(value: Billeteras) {
    this._vendedor = value
  }

  public get comprador(): Billeteras {
    return this._comprador
  }

  public set comprador(value: Billeteras) {
    this._comprador = value
  }

  public get tokenVenta(): Tokens {
    return this._tokenVenta
  }

  public set tokenVenta(value: Tokens) {
    this._tokenVenta = value
  }

  public get tokenCompra(): Tokens {
    return this._tokenCompra
  }

  public set tokenCompra(value: Tokens) {
    this._tokenCompra = value
  }

  public get montoVenta(): bigint {
    return this._montoVenta
  }

  public set montoVenta(value: bigint) {
    this._montoVenta = value
  }

  public get montoCompra(): bigint {
    return this._montoCompra
  }

  public set montoCompra(value: bigint) {
    this._montoCompra = value
  }

  public get fechaCreacion(): Date {
    return this._fechaCreacion
  }

  public set fechaCreacion(value: Date) {
    this._fechaCreacion = value
  }

  public get fechaEjecucion(): Date | undefined {
    return this._fechaEjecucion
  }

  public set fechaEjecucion(value: Date | undefined) {
    this._fechaEjecucion = value
  }

  public get fechaCaducidad(): Date {
    return this._fechaCaducidad
  }

  public set fechaCaducidad(value: Date) {
    this._fechaCaducidad = value
  }

  public get montoVentaUSD(): number {
    return this._montoVentaUSD
  }

  public set montoVentaUSD(value: number) {
    this._montoVentaUSD = value
  }

  public get montoCompraUSD(): number {
    return this._montoCompraUSD
  }

  public set montoCompraUSD(value: number) {
    this._montoCompraUSD = value
  }

  public get estado(): EstadosOrdenes {
    return this._estado
  }

  public get tipo(): TiposOrdenes {
    return this._tipo
  }
}
