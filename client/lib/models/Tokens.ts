import { Estados } from '../common'
export default class Tokens {
  private _ticker: string
  private _contrato: string
  private _oraculo: string | undefined
  private _decimales: number
  private _estado: Estados

  constructor(
    ticker: string,
    contrato: string,
    oraculo: string,
    decimales: number
  ) {
    this._ticker = ticker
    this._contrato = contrato
    this._oraculo = oraculo
    this._decimales = decimales
    this._estado = Estados.activo
  }

  public get ticker(): string {
    return this._ticker
  }
  public set ticker(value: string) {
    this._ticker = value
  }
  public get contrato(): string {
    return this._contrato
  }
  public set contrato(value: string) {
    this._contrato = value
  }
  public get oraculo(): string | undefined {
    return this._oraculo
  }
  public set oraculo(value: string | undefined) {
    this._oraculo = value
  }
  public get decimales(): number {
    return this._decimales
  }
  public set decimales(value: number) {
    this._decimales = value
  }
  public get estado(): Estados {
    return this._estado
  }
}
