// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Datos.sol";
import "./GestorTokens.sol";

import "hardhat/console.sol";

contract GestorOrdenes is Datos, GestorTokens {
  /**
   * @dev si el punto de partida es vacío, arranca por la última orden
   */
  function listarOrdenesActivas(
    bytes32 _puntoPartida, // OBS: el puntoPartida es la última orden listada
    uint _ventana
  ) public view returns (Orden[] memory) {
    Orden[] memory listado = new Orden[](ordenes.cantidadActivas);
    Orden memory orden;
    uint indiceResultado = 0;
    bytes32 idOrdenSiguiente = 0x00;

    if (ordenes.cantidadActivas == 0) {
      return listado;
    }

    if (_puntoPartida == 0x00) {
      idOrdenSiguiente = ordenes.ultimaOrdenActiva;
    } else {
      idOrdenSiguiente = ordenes.archivo[_puntoPartida].siguienteOrdenActiva;
    }

    do {
      orden = ordenes.archivo[idOrdenSiguiente];

      listado[indiceResultado++] = orden;
      idOrdenSiguiente = orden.siguienteOrdenActiva;
    } while (indiceResultado < _ventana && idOrdenSiguiente != 0x00);

    return listado;
  }

  function listarMisOrdenes() public view returns (Orden[] memory) {
    bytes32[] memory ordenesPorBilletera = ordenes.porBilletera[msg.sender];
    Orden[] memory listado = new Orden[](ordenesPorBilletera.length);

    if (billeterasRegistradas[msg.sender].existe) {
      for (uint index = 0; index < ordenesPorBilletera.length; index++) {
        listado[index] = ordenes.archivo[ordenesPorBilletera[index]];
      }
    }

    return listado;
  }

  function nuevaOrden(
    string memory _tokenCompra,
    string memory _tokenVenta,
    uint256 _montoCompra,
    uint256 _montoVenta,
    TipoOrden _tipo
  ) public returns (bool creada, Orden memory) {
    bytes32 idOrdenAux;

    // Plataforma activa
    require(
      plataforma.estado == EstadoGeneral.ACTIVO,
      "La plataforma se encuentra inactiva"
    );

    // Ningún campo vacío o 0
    require(
      !(emptyString(_tokenCompra) ||
        emptyString(_tokenVenta) ||
        _montoVenta == 0 ||
        (_montoCompra == 0 && _tipo == TipoOrden.COMPRA_VENTA)),
      "No se aceptan campos vacios"
    );

    // Montos válidos
    require(
      _montoVenta > 0 && (_montoCompra > 0 || _tipo != TipoOrden.COMPRA_VENTA),
      "Los montos ingresados son invalidos"
    );

    // Tokens registrados
    require(
      tokensRegistrados[_tokenCompra].existe &&
        tokensRegistrados[_tokenVenta].existe,
      "Los tokens no son validos o no estan registrados"
    );

    // Tokens activos
    require(
      tokensRegistrados[_tokenCompra].estado == EstadoGeneral.ACTIVO &&
        tokensRegistrados[_tokenVenta].estado == EstadoGeneral.ACTIVO,
      "Uno o ambos tokens se encuentran inactivos para operar"
    );

    // Billetera activa
    require(
      (billeterasRegistradas[msg.sender].existe &&
        billeterasRegistradas[msg.sender].estado == EstadoGeneral.ACTIVO) ||
        !billeterasRegistradas[msg.sender].existe,
      "Billetera bloqueada"
    );

    // Monto mínimo (equivalente en USD)
    int256 cotizacion = consultarCotizacion(_tokenVenta);
    require(
      (uint256(_montoVenta) * uint256(cotizacion)) /
        10 ** uint256(tokensRegistrados[_tokenVenta].decimales) >=
        plataforma.montoMinimoUSD,
      "El monto a intercambiar es inferior al minimo aceptable en USD"
    );

    // Saldo suficiente para la transferencia
    ERC20 contratoToken = ERC20(tokensRegistrados[_tokenVenta].contrato);
    uint256 saldo = contratoToken.balanceOf(msg.sender);
    require(saldo >= _montoVenta, "Saldo de token insuficiente para cambiar");

    // Credito aprobado suficiente
    uint256 credito = contratoToken.allowance(msg.sender, address(this));
    require(
      credito >= _montoVenta,
      "Saldo aprobado insuficiente para transferir"
    );

    // Transferir fondos desde el vendedor
    bool respuestaTransferencia = contratoToken.transferFrom(
      msg.sender,
      address(this),
      _montoVenta
    );

    // Revertir transacción si falla el depósito de tokens
    if (!respuestaTransferencia) {
      revert("Fallo en la transferencia de tokens al contrato");
    }

    idOrdenAux = keccak256(
      abi.encode(
        _tokenCompra,
        _tokenVenta,
        _tipo,
        ordenes.cantidadTotal,
        msg.sender
      )
    );

    // Guardar en el archivo de ordenes
    Orden storage ordenNueva = ordenes.archivo[idOrdenAux];
    ordenes.cantidadTotal++;

    ordenNueva.idOrden = idOrdenAux;
    ordenNueva.tokenCompra = _tokenCompra;
    ordenNueva.montoCompra = _montoCompra; // OBS: Si la orden es del tipo INTERCAMBIO entonces es 0
    ordenNueva.tokenVenta = _tokenVenta;
    ordenNueva.montoVenta = _montoVenta;
    ordenNueva.vendedor = msg.sender;
    ordenNueva.fechaCreacion = block.timestamp;
    ordenNueva.estado = EstadoOrden.ACTIVA;
    ordenNueva.tipo = _tipo;
    ordenNueva.existe = true;

    // Apilar en ordenes activas
    Orden storage ordenUltimaActiva;

    if (ordenes.ultimaOrdenActiva != 0x00) {
      ordenUltimaActiva = ordenes.archivo[ordenes.ultimaOrdenActiva];
      ordenUltimaActiva.anteriorOrdenActiva = ordenNueva.idOrden;
      ordenNueva.siguienteOrdenActiva = ordenUltimaActiva.idOrden;
      ordenNueva.anteriorOrdenActiva = 0x00;
    }
    ordenes.ultimaOrdenActiva = ordenNueva.idOrden;
    ordenes.cantidadActivas++;

    // Enfilar por billetera
    ordenes.porBilletera[msg.sender].push(ordenNueva.idOrden); // IMPROVE: debería pasarlo a billeterasRegistradas
    billeterasRegistradas[msg.sender].direccion = msg.sender;
    billeterasRegistradas[msg.sender].rol = RolBilletera.USUARIO;
    billeterasRegistradas[msg.sender].estado = EstadoGeneral.ACTIVO;
    billeterasRegistradas[msg.sender].existe = true;

    // Enfilar en ordenes gemelas
    bytes32 grupoHashGuardado = keccak256(
      abi.encode(_tokenCompra, _tokenVenta, _montoCompra, _montoVenta) // OBS: Orden para guardar
    );

    MapGrupoOrdenHash storage listaGemelas = ordenes.grupos[grupoHashGuardado];
    Orden storage ordenUltimaGemela;

    if (!listaGemelas.existe) {
      listaGemelas.existe = true;
      listaGemelas.idOrdenCabecera = ordenNueva.idOrden;
    } else {
      ordenUltimaGemela = ordenes.archivo[listaGemelas.idOrdenFinal];
      ordenUltimaGemela.siguienteOrdenGemela = ordenNueva.idOrden;
      ordenNueva.anteriorOrdenGemela = ordenUltimaGemela.idOrden;
      ordenNueva.siguienteOrdenGemela = 0x00;
    }
    listaGemelas.idOrdenFinal = ordenNueva.idOrden;

    creada = true;
    emit NuevaOrden(ordenNueva);

    return (creada, ordenNueva);
  }

  function ejecutarOrden(bytes32 _idOrden) public returns (bool exito) {
    // Comprador activo
    require(
      (billeterasRegistradas[msg.sender].existe &&
        billeterasRegistradas[msg.sender].estado == EstadoGeneral.ACTIVO) ||
        !billeterasRegistradas[msg.sender].existe,
      "Billetera bloqueada"
    );

    // Vendedor activo
    Orden storage ordenEjecutada = ordenes.archivo[_idOrden];
    require(
      billeterasRegistradas[ordenEjecutada.vendedor].estado ==
        EstadoGeneral.ACTIVO,
      "Billetera bloqueada"
    );

    // Orden activa
    require(
      ordenEjecutada.estado == EstadoOrden.ACTIVA,
      "La orden ya no se encuentra activa"
    );

    /**************************************************************************/

    int256 precioTokenVenta;
    int256 precioTokenCompra;

    if (ordenEjecutada.tipo == TipoOrden.INTERCAMBIO) {
      precioTokenVenta = consultarCotizacion(ordenEjecutada.tokenVenta);
      precioTokenCompra = consultarCotizacion(ordenEjecutada.tokenCompra);

      require(
        precioTokenCompra != 0 && precioTokenVenta != 0,
        "No se pudo obtener datos de cotizacion"
      );

      uint256 relacion = (uint256(precioTokenVenta) *
        ordenEjecutada.montoVenta) / uint256(precioTokenCompra);

      ordenEjecutada.montoCompra = relacion;
    }

    /**************************************************************************/

    // Saldo suficiente para la transferencia
    ERC20 contratoTokenCompra = ERC20(
      tokensRegistrados[ordenEjecutada.tokenCompra].contrato
    );
    uint256 saldo = contratoTokenCompra.balanceOf(msg.sender);
    require(
      saldo >= ordenEjecutada.montoCompra,
      "Saldo de token insuficiente para cambiar"
    );

    // Credito aprobado suficiente
    uint256 credito = contratoTokenCompra.allowance(msg.sender, address(this));
    require(
      credito >= ordenEjecutada.montoCompra,
      "Saldo aprobado insuficiente para transferir"
    );

    // Transferir fondos de comprador a vendedor
    bool respuestaTransferencia;
    respuestaTransferencia = contratoTokenCompra.transferFrom(
      msg.sender,
      ordenEjecutada.vendedor,
      ordenEjecutada.montoCompra
    );

    // Revertir transacción si falla el depósito de tokens
    if (!respuestaTransferencia) {
      revert("Fallo en la transferencia de tokens al vendedor");
    }

    // Transferir fondos del contrato a comprador
    ERC20 contratoTokenVenta = ERC20(
      tokensRegistrados[ordenEjecutada.tokenVenta].contrato
    );
    respuestaTransferencia = contratoTokenVenta.transfer(
      msg.sender,
      ordenEjecutada.montoVenta
    );

    // Revertir transacción si falla el depósito de tokens
    if (!respuestaTransferencia) {
      revert("Fallo en la transferencia de tokens al comprador");
    }

    /**************************************************************************/

    ordenEjecutada.estado = EstadoOrden.FINALIZADA;
    ordenEjecutada.comprador = msg.sender;
    ordenEjecutada.fechaFinalizacion = block.timestamp;

    Orden storage ordenSiguiente;
    Orden storage ordenAnterior;

    // Quitar de ordenes activas
    ordenSiguiente = ordenes.archivo[ordenEjecutada.siguienteOrdenActiva];
    ordenAnterior = ordenes.archivo[ordenEjecutada.anteriorOrdenActiva];

    if (ordenes.cantidadActivas == 1) {
      // OBS: solo hay una orden activa
      ordenes.ultimaOrdenActiva = 0x00;
    } else if (ordenes.ultimaOrdenActiva == ordenEjecutada.idOrden) {
      // OBS: es el tope de la pila
      ordenes.ultimaOrdenActiva = ordenSiguiente.idOrden;
      ordenSiguiente.anteriorOrdenActiva = 0x00;
    } else if (ordenEjecutada.siguienteOrdenActiva == 0x00) {
      // OBS: es la base de la pila
      ordenAnterior.siguienteOrdenActiva = 0x00;
    } else {
      // OBS: se encuentra en el medio de la pila
      ordenAnterior.siguienteOrdenActiva = ordenSiguiente.idOrden;
      ordenSiguiente.anteriorOrdenActiva = ordenAnterior.idOrden;
    }
    ordenEjecutada.siguienteOrdenActiva = 0x00;
    ordenEjecutada.anteriorOrdenActiva = 0x00;
    ordenes.cantidadActivas--;

    // Guardar datos de comprador
    billeterasRegistradas[msg.sender].direccion = msg.sender;
    billeterasRegistradas[msg.sender].rol = RolBilletera.USUARIO;
    billeterasRegistradas[msg.sender].estado = EstadoGeneral.ACTIVO;
    billeterasRegistradas[msg.sender].existe = true;

    // Quitar de ordenes gemelas
    bytes32 grupoHashGuardado = keccak256(
      abi.encode(
        ordenEjecutada.tokenCompra,
        ordenEjecutada.tokenVenta,
        ordenEjecutada.montoCompra,
        ordenEjecutada.montoVenta
      ) // OBS: Orden para guardar
    );

    MapGrupoOrdenHash storage listaGemelas = ordenes.grupos[grupoHashGuardado];

    ordenAnterior = ordenes.archivo[ordenEjecutada.anteriorOrdenGemela];
    ordenSiguiente = ordenes.archivo[ordenEjecutada.siguienteOrdenGemela];

    if (
      listaGemelas.idOrdenCabecera == ordenEjecutada.idOrden &&
      listaGemelas.idOrdenFinal == ordenEjecutada.idOrden
    ) {
      // OBS: es la única orden en la lista
      listaGemelas.idOrdenCabecera = 0x00;
      listaGemelas.idOrdenFinal = 0x00;
      listaGemelas.existe = false;
    } else if (listaGemelas.idOrdenCabecera == ordenEjecutada.idOrden) {
      // OBS: es la orden cabecera
      listaGemelas.idOrdenCabecera = ordenSiguiente.idOrden;
      ordenSiguiente.anteriorOrdenGemela = 0x00;
    } else if (listaGemelas.idOrdenFinal == ordenEjecutada.idOrden) {
      // OBS: es la orden final
      listaGemelas.idOrdenFinal = ordenAnterior.idOrden;
      ordenAnterior.anteriorOrdenGemela = 0x00;
    } else {
      // OBS: es una orden en el medio
      ordenAnterior.siguienteOrdenGemela = ordenEjecutada.siguienteOrdenGemela;
      ordenSiguiente.anteriorOrdenGemela = ordenEjecutada.anteriorOrdenGemela;
    }
    ordenEjecutada.siguienteOrdenGemela = 0x00;
    ordenEjecutada.anteriorOrdenGemela = 0x00;

    exito = true;
    return exito;
  }

  function cancelarOrden(bytes32 _idOrden) public returns (bool exito) {
    Orden storage ordenCancelada = ordenes.archivo[_idOrden];

    // Orden activa
    require(
      ordenCancelada.estado == EstadoOrden.ACTIVA,
      "La orden ya se encuentra cancelada o finalizada"
    );

    // Devolver fondos del contrato a vendedor
    ERC20 contratoTokenVenta = ERC20(
      tokensRegistrados[ordenCancelada.tokenVenta].contrato
    );
    bool respuestaTransferencia = contratoTokenVenta.transfer(
      msg.sender,
      ordenCancelada.montoVenta
    );

    // Revertir transacción si falla el depósito de tokens
    if (!respuestaTransferencia) {
      revert("Fallo en la devolucion de tokens al vendedor");
    }

    /**************************************************************************/

    ordenCancelada.estado = EstadoOrden.CANCELADA;
    ordenCancelada.fechaFinalizacion = block.timestamp;

    Orden storage ordenSiguiente;
    Orden storage ordenAnterior;

    // Quitar de ordenes activas
    ordenSiguiente = ordenes.archivo[ordenCancelada.siguienteOrdenActiva];
    ordenAnterior = ordenes.archivo[ordenCancelada.anteriorOrdenActiva];

    if (ordenes.cantidadActivas == 1) {
      // OBS: solo hay una orden activa
      ordenes.ultimaOrdenActiva = 0x00;
    } else if (ordenes.ultimaOrdenActiva == ordenCancelada.idOrden) {
      // OBS: es el tope de la pila
      ordenes.ultimaOrdenActiva = ordenSiguiente.idOrden;
      ordenSiguiente.anteriorOrdenActiva = 0x00;
    } else if (ordenCancelada.siguienteOrdenActiva == 0x00) {
      // OBS: es la base de la pila
      ordenAnterior.siguienteOrdenActiva = 0x00;
    } else {
      // OBS: se encuentra en el medio de la pila
      ordenAnterior.siguienteOrdenActiva = ordenSiguiente.idOrden;
      ordenSiguiente.anteriorOrdenActiva = ordenAnterior.idOrden;
    }
    ordenCancelada.siguienteOrdenActiva = 0x00;
    ordenCancelada.anteriorOrdenActiva = 0x00;
    ordenes.cantidadActivas--;

    /**************************************************************************/

    // Quitar de ordenes gemelas
    bytes32 grupoHashGuardado = keccak256(
      abi.encode(
        ordenCancelada.tokenCompra,
        ordenCancelada.tokenVenta,
        ordenCancelada.montoCompra,
        ordenCancelada.montoVenta
      ) // OBS: Orden para guardar
    );

    MapGrupoOrdenHash storage listaGemelas = ordenes.grupos[grupoHashGuardado];

    ordenAnterior = ordenes.archivo[ordenCancelada.anteriorOrdenGemela];
    ordenSiguiente = ordenes.archivo[ordenCancelada.siguienteOrdenGemela];

    if (
      listaGemelas.idOrdenCabecera == ordenCancelada.idOrden &&
      listaGemelas.idOrdenFinal == ordenCancelada.idOrden
    ) {
      // OBS: es la única orden en la lista
      listaGemelas.idOrdenCabecera = 0x00;
      listaGemelas.idOrdenFinal = 0x00;
      listaGemelas.existe = false;
    } else if (listaGemelas.idOrdenCabecera == ordenCancelada.idOrden) {
      // OBS: es la orden cabecera
      listaGemelas.idOrdenCabecera = ordenSiguiente.idOrden;
      ordenSiguiente.anteriorOrdenGemela = 0x00;
    } else if (listaGemelas.idOrdenFinal == ordenCancelada.idOrden) {
      // OBS: es la orden final
      listaGemelas.idOrdenFinal = ordenAnterior.idOrden;
      ordenAnterior.anteriorOrdenGemela = 0x00;
    } else {
      // OBS: es una orden en el medio
      ordenAnterior.siguienteOrdenGemela = ordenCancelada.siguienteOrdenGemela;
      ordenSiguiente.anteriorOrdenGemela = ordenCancelada.anteriorOrdenGemela;
    }
    ordenCancelada.siguienteOrdenGemela = 0x00;
    ordenCancelada.anteriorOrdenGemela = 0x00;

    exito = true;
    return exito;
  }

  function buscarOrdenGemela(
    string memory _tokenCompra,
    string memory _tokenVenta,
    uint256 _montoCompra,
    uint256 _montoVenta
  ) public view returns (bytes32 idOrden) {
    bytes32 grupoHashGuardado = keccak256(
      abi.encode(_tokenVenta, _tokenCompra, _montoVenta, _montoCompra) // OBS: Orden para consultar (Gemela)
    );

    MapGrupoOrdenHash storage listaGemelas = ordenes.grupos[grupoHashGuardado];
    Orden storage ordenCabeceraGrupo;

    if (listaGemelas.existe) {
      ordenCabeceraGrupo = ordenes.archivo[listaGemelas.idOrdenCabecera];
      idOrden = ordenCabeceraGrupo.idOrden;
    }

    return idOrden;
  }

  function buscarOrden(bytes32 _idOrden) public view returns (Orden memory) {
    Orden storage resultado = ordenes.archivo[_idOrden];
    require(resultado.existe, "La orden solicitada no existe");
    return resultado;
  }
}
