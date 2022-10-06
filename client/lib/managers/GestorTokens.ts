import IGestor from '../Interfaces/IGestor'
import Tokens from '../models/Tokens'
export default class GestorTokens implements IGestor<Tokens> {
  private _tokens: Array<Tokens>

  constructor() {
    this._tokens = []
  }

  nuevo(obj: Tokens): boolean {
    this._tokens.concat([obj])
    return true
  }
  modificar(obj: Tokens): boolean {
    this._tokens[0] = obj
    return true
  }
  buscar(): Tokens[] {
    return this._tokens
  }
}
