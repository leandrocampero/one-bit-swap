// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

abstract contract Datos {
  enum EstadoOrden {
    ACTIVA,
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
    ADMINISTRADOR,
    PROPIETARIO
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
    uint256 indiceAdmin;
    uint256 indiceBloqueado;
    RolBilletera rol;
    EstadoGeneral estado;
    bool existe;
    string[] ordenes;
  }

  struct MapBilletera {
    Billetera billetera;
    mapping(address => string[]) ordenes;
  }

  // IMPROVE: ¿Se puede asociar una librería con métodos de pila y fila?
  // IMPROVE: pushActiva, popActiva, queueGemela, dequeueGemela
  struct Orden {
    bytes32 idOrden;
    bytes32 siguienteOrdenActiva; // OBS: Implementa una PILA
    bytes32 anteriorOrdenActiva;
    bytes32 siguienteOrdenGemela; // OBS: Implementa una FILA
    bytes32 anteriorOrdenGemela;
    address vendedor;
    address comprador;
    uint256 montoVenta;
    uint256 montoCompra;
    uint256 fechaCreacion;
    uint256 fechaFinalizacion;
    EstadoOrden estado;
    TipoOrden tipo;
    bool existe;
    string tokenCompra;
    string tokenVenta;
  }

  struct MapGrupoOrdenHash {
    bool existe;
    bytes32 idOrdenCabecera;
    bytes32 idOrdenFinal;
  }

  struct Plataforma {
    EstadoGeneral estado;
    address propietario;
    uint256 montoMinimoUSD;
  }

  /****************************************************************************/

  event NuevaOrden(Orden respuesta);
  event NuevoAdministrador(Billetera respuesta);
  event NuevoToken(Token respuesta);

  /****************************************************************************/

  struct ArchivoOrdenes {
    mapping(bytes32 => Orden) archivo; // OBS: idOrden -> Orden
    mapping(address => bytes32[]) porBilletera;
    mapping(bytes32 => MapGrupoOrdenHash) grupos; // OBS: hashOrden -> idOrden (referencia al primer nodo en la fila)
    uint cantidadTotal;
    uint cantidadActivas;
    bytes32 ultimaOrdenActiva; // OBS: referencia el tope de la pila
  }

  struct ArchivoBilleteras {
    mapping(address => MapBilletera) archivo;
    address[] bloqueadas;
    address[] administradores;
  }

  /****************************************************************************/

  Plataforma public plataforma;

  ArchivoOrdenes public ordenes;

  mapping(string => Token) public tokensRegistrados; // OBS: ticker -> Token
  string[] tokensListado; // IMPROVE: posiblemente haya que mejorarlo, pero como no es primordial el ordenamiento para este array, queda así momentaneamente
  uint tokensCantidadActivos;
  uint tokensCantidadTotal;

  mapping(address => Billetera) public billeterasRegistradas; // REVIEW: Se decide hacer un archivo de billeteras porque se necesita tanto buscarlas para interactuar con ellas como listarlas
  address[] billeterasBloqueadas; // IMPROVE: Se podría mejorar haciendo también una lista enlazada para un pagínado filtrado. Pero queda como actualización
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
      (billeterasRegistradas[msg.sender].existe &&
        billeterasRegistradas[msg.sender].rol == RolBilletera.ADMINISTRADOR) ||
        msg.sender == plataforma.propietario,
      "Solo pueden acceder administradores"
    );
    _;
  }

  modifier billeteraActiva() {
    require(
      (billeterasRegistradas[msg.sender].existe &&
        billeterasRegistradas[msg.sender].estado == EstadoGeneral.ACTIVO) ||
        !billeterasRegistradas[msg.sender].existe,
      "La billetera esta bloqueada"
    );
    _;
  }

  /****************************************************************************/

  /**
   * @dev es la única forma que se encuentra hasta ahora para determinar cadenas vacías
   */
  function emptyString(string memory _string) public pure returns (bool) {
    bytes memory bytesArray = bytes(_string);
    return bytesArray.length == 0;
  }

  /**
   * @notice devuelve el resultado de una multiplicación exponencial decimal (n*10^e) de manera segura
   * @dev contempla exponentes negativos, además de usar el algoritmo de potencia por cuadrados
   */
  function safeMulExp(
    int256 number,
    int256 exponent
  ) public pure returns (int256) {
    if (exponent == 0) {
      return number;
    } else if (exponent > 0) {
      return number * expBySquaring(10, exponent);
    } else {
      return number / expBySquaring(10, -exponent);
    }
  }

  function expBySquaring(
    int256 number,
    int256 exponent
  ) public pure returns (int256) {
    if (exponent == 0) {
      return 1;
    } else if (exponent % 2 == 0) {
      return expBySquaring(number * number, exponent / 2);
    } else {
      return number * expBySquaring(number * number, (exponent - 1) / 2);
    }
  }
}
