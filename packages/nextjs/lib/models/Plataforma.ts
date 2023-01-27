import GestorBilleteras from 'lib/managers/GestorBilleteras'
import GestorOrdenes from 'lib/managers/GestorOrdenes'
import GestorTokens from 'lib/managers/GestorTokens'

export default class Plataforma {
  private _estado: number
  private _contrato: string
  private _chainid: number
  private _gestorTokens: GestorTokens
  private _gestorBilleteras: GestorBilleteras
  private _gestorOrdenes: GestorOrdenes

  constructor(
    estado: number,
    contrato: string,
    chainid: number,
    gestorTokens: GestorTokens,
    gestorBilleteras: GestorBilleteras,
    gestorOrdenes: GestorOrdenes
  ) {
    this._estado = estado
    this._contrato = contrato
    this._chainid = chainid
    this._gestorTokens = gestorTokens
    this._gestorBilleteras = gestorBilleteras
    this._gestorOrdenes = gestorOrdenes
  }

  public get estado(): number {
    return this._estado
  }

  public set estado(value: number) {
    this._estado = value
  }

  public get contrato(): string {
    return this._contrato
  }

  public set contrato(value: string) {
    this._contrato = value
  }

  public get chainid(): number {
    return this._chainid
  }

  public set chainid(value: number) {
    this._chainid = value
  }

  public get gestorTokens(): GestorTokens {
    return this._gestorTokens
  }

  public set gestorTokens(value: GestorTokens) {
    this._gestorTokens = value
  }

  public get gestorBilleteras(): GestorBilleteras {
    return this._gestorBilleteras
  }

  public set gestorBilleteras(value: GestorBilleteras) {
    this._gestorBilleteras = value
  }

  public get gestorOrdenes(): GestorOrdenes {
    return this._gestorOrdenes
  }

  public set gestorOrdenes(value: GestorOrdenes) {
    this._gestorOrdenes = value
  }
}
