export enum Estados {
  activo = 0,
  suspendido = 1,
}

export enum EstadosOrdenes {
  activa = 0,
  bloqueada = 1,
  cancelada = 2,
  finalizada = 3,
}

export enum TiposOrdenes {
  compraVenta = 0,
  intercambio = 1,
}

export enum RolesBilleteras {
  usuario = 0,
  administrador = 1,
  propietario = 2,
}

export declare global {
  interface Window {
    ethereum: any
  }
}
