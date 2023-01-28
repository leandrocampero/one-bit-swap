import Ordenes from 'lib/models/Ordenes'
export default class GestorOrdenes {
  private _ordenes: Array<Ordenes>

  constructor() {
    this._ordenes = []
  }

  nuevo(obj: Ordenes): boolean {
    this._ordenes.concat([obj])
    return true
  }

  modificar(obj: Ordenes): boolean {
    this._ordenes[0] = obj
    return true
  }

  buscar(): Ordenes[] {
    return this._ordenes
  }
}
