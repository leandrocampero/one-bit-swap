export enum Estados {
  activo = 1,
  suspendido = 2,
}

export enum EstadosOrdenes {
  activa = 1,
  bloqueada = 2,
  cancelada = 3,
  finalizada = 4,
}

export enum TiposOrdenes {
  compraVenta = 'C',
  intercambio = 'I',
}

export enum RolesBilleteras {
  usuario = 1,
  administrador = 2,
  propietario = 3,
}
