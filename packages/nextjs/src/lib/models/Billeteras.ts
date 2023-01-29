import { Estados, RolesBilleteras } from '@/lib/types.d'
export default class Billeteras {
  private _direccion: string
  private _rol: RolesBilleteras
  private _estado: Estados

  constructor(direccion: string) {
    this._direccion = direccion
    this._rol = RolesBilleteras.usuario
    this._estado = Estados.activo
  }

  public Activar(): string {
    return BlockchainAdapter.ActivarToken(this._ticker)
  }

  public get direccion(): string {
    return this._direccion
  }

  public set direccion(value: string) {
    this._direccion = value
  }

  public get rol(): RolesBilleteras {
    return this._rol
  }

  public set rol(value: RolesBilleteras) {
    this._rol = value
  }

  public get estado(): Estados {
    return this._estado
  }

  // todo: auxliar luego borrar
  public set estado(value: Estados) {
    this._estado = value
  }
}
