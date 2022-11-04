// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

abstract contract Datos {
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

  enum RolBilletera {
    USUARIO,
    ADMINISTRADOR
  }

  /****************************************************************************/

  struct Token {
    string ticker;
    address contrato;
    address oraculo;
    uint8 decimales;
    EstadoGeneral estado;
    bool existe; // OBS: usado para determinar si se encuentra en el mapping
  }

  struct Billetera {
    address direccion;
    string[] ordenes;
    RolBilletera rol;
    EstadoGeneral estado;
    bool existe;
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
    string siguienteOrden;
    string anteriorOrden;
    bool existe;
  }

  struct Plataforma {
    EstadoGeneral estado;
    address propietario;
    uint montoMinimoUSD;
  }

  /****************************************************************************/

  type ContadorOrdenes is uint;

  struct ArchivoOrdenes {
    mapping(string => Orden) ordenes; // OBS: idOrden -> Orden
    ContadorOrdenes cantidadTotal;
    ContadorOrdenes cantidadActivas;
    string ultimaOrdenActiva; // OBS: para implementar la lista enlazada, este es el punto de inicio
  }

  /****************************************************************************/

  Plataforma public plataforma;

  ArchivoOrdenes public archivoOrdenes;

  mapping(string => Token) public tokensMap; // OBS: ticker -> Token
  string[] tokensArray; // IMPROVE: posiblemente haya que mejorarlo
  // IMPROVE: pero como no es primordial el ordenamiento para este array, queda así momentaneamente

  mapping(address => Billetera) billeterasMap;
  address[] billeterasBloqueadas;
  address[] billeterasAdministradores;

  /****************************************************************************/

  modifier plataformaActiva() {
    require(
      plataforma.estado == EstadoGeneral.ACTIVO,
      "La plataforma se encuentra inactiva"
    );
    _;
  }

  modifier soloPropietario() {
    require(
      msg.sender == plataforma.propietario,
      "Solo el propietario puede acceder"
    );
    _;
  }

  modifier soloAdministrador() {
    require(
      billeterasMap[msg.sender].rol == RolBilletera.ADMINISTRADOR ||
        msg.sender == plataforma.propietario,
      "Solo pueden acceder administradores"
    );
    _;
  }

  modifier billeteraActiva() {
    require(
      billeterasMap[msg.sender].existe &&
        billeterasMap[msg.sender].estado == EstadoGeneral.ACTIVO,
      "La billetera esta suspendida o no existe"
    );
    _;
  }

  /****************************************************************************/

  /**
   * @dev es la única forma que se encuentra hasta ahora para determinar cadenas vacías
   */
  function emptyString(string memory _string) public pure returns (bool) {
    bytes memory bytesArray = bytes(_string);
    return bytesArray.length > 0;
  }
}
