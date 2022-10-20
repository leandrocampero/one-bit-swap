// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

abstract contract CoreData {
  // REVIEW: Se encuentra bajo revisión
  enum EstadoOrden {
    ACTIVA,
    BLOQUEADA,
    CANCELADA,
    FINALIZADA
  }

  enum EstadoGeneral {
    ACTIVO,
    SUSPENDIDO
  }

  enum TipoOrden {
    COMPRA_VENTA,
    INTERCAMBIO
  }

  /****************************************************************************/

  struct Token {
    string ticker;
    address contrato;
    address oraculo;
    uint8 decimales;
    EstadoGeneral estado;
  }

  struct Orden {
    string idOrden;
    address vendedor;
    address comprador;
    Token tokenVenta;
    Token tokenCompra;
    uint256 montoVenta;
    uint256 montoCompra;
    uint256 fechaCreacion;
    uint256 fechaEjecucion;
    uint256 fechaCaducidad;
    EstadoOrden estado;
    TipoOrden tipo;
    uint indice;
  }

  struct OrdenIndexada {
    string idOrden;
    bool activa;
  }

  type ContadorOrdenes is uint;

  struct MapaIterableOrdenes {
    mapping(string => Orden) mapOrdenes;
    OrdenIndexada[] arrayOrdenes;
    ContadorOrdenes cantidadActivas;
  }

  /****************************************************************************/

  address[] public billeterasBloqueadas;
  address[] public administradores;
}
