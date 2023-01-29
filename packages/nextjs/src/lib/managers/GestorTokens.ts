import Tokens from '@/lib/models/Tokens'
export default class GestorTokens {
  private _tokens: Array<Tokens>
  private static _gestor: GestorTokens

  constructor() {
    this._tokens = []
  }

  public static instanciar(): GestorTokens {
    if (!this._gestor) {
      GestorTokens._gestor = new GestorTokens()
    }

    return GestorTokens._gestor
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
