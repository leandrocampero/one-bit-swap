import Billeteras from 'lib/models/Billeteras'
import { RolesBilleteras } from 'lib/types.d'

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

  /**
   * Verifica si una billetera tiene rol Propietario o Administrador
   * Devuelve el rol que posee la billetera en cuestion, en caso de no tener
   * un rol o poseer un rol incorrecto, devuelve 1 (rol de Usuario)
   */
  verificarRol(billetera: Billeteras | undefined): RolesBilleteras {
    return billetera?.rol == RolesBilleteras.administrador ||
      billetera?.rol == RolesBilleteras.propietario
      ? billetera?.rol
      : RolesBilleteras.usuario
  }
}
