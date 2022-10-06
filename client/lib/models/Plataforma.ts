import IGestor from '../Interfaces/IGestor'
import Billeteras from './Billeteras'
import Ordenes from './Ordenes'
import Tokens from './Tokens'
export default class Plataforma {
  private _estado: number
  private _contrato: string
  private _chainid: number
  private _gestorTokens: IGestor<Tokens>
  private _gestorBilleteras: IGestor<Billeteras>
  private _gestorOrdenes: IGestor<Ordenes>

  constructor(
    estado: number,
    contrato: string,
    chainid: number,
    gestorTokens: IGestor<Tokens>,
    gestorBilleteras: IGestor<Billeteras>,
    gestorOrdenes: IGestor<Ordenes>
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

  public get gestorTokens(): IGestor<Tokens> {
    return this._gestorTokens
  }

  public set gestorTokens(value: IGestor<Tokens>) {
    this._gestorTokens = value
  }

  public get gestorBilleteras(): IGestor<Billeteras> {
    return this._gestorBilleteras
  }

  public set gestorBilleteras(value: IGestor<Billeteras>) {
    this._gestorBilleteras = value
  }

  public get gestorOrdenes(): IGestor<Ordenes> {
    return this._gestorOrdenes
  }

  public set gestorOrdenes(value: IGestor<Ordenes>) {
    this._gestorOrdenes = value
  }
}
