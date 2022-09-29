import Billeteras from '@models/Billeteras'
import IGestor from '../Interfaces/IGestor'

export default class GestorBilleteras implements IGestor<Billeteras> {
  private _billeteras: Array<Billeteras>

  nuevo(obj: Billeteras): boolean {
    this._billeteras.concat([obj])
    return true
  }
  modificar(obj: Billeteras): boolean {
    this._billeteras[0] = obj
    return true
  }
  buscar(): Billeteras[] {
    return this._billeteras
  }

  constructor() {
    this._billeteras = []
  }
}
