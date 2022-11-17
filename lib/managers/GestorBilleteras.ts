import Billeteras from '@models/Billeteras'

export default class GestorBilleteras {
  private _billeteras: Array<Billeteras>

  constructor() {
    this._billeteras = []
  }

  nuevo(direccion: string): Billeteras {
    const obj = new Billeteras(direccion)
    this._billeteras.concat([obj])
    return obj
  }

  modificar(obj: Billeteras): boolean {
    this._billeteras[0] = obj
    return true
  }

  buscar(): Billeteras[] {
    return this._billeteras
  }
}
