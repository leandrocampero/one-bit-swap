export enum Estados {
  activo = 1,
  suspendido,
}

export enum EstadosOrdenes {
  activa = 1,
  bloqueada,
  cancelada,
  finalizada,
}

export enum TiposOrdenes {
  compraVenta = 'C',
  intercambio = 'I',
}

export enum RolesBilleteras {
  usuario = 1,
  administrador,
  propietario,
}
