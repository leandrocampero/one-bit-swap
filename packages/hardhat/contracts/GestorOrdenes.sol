// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Datos.sol";
import "./GestorTokens.sol";

contract GestorOrdenes is Datos, GestorTokens {
  /**
   * @dev si el punto de partida es vacío, arranca por la última orden
   */
  function listarOrdenesActivas(
    bytes32 _puntoPartida, // OBS: el puntoPartida es la última orden listada
    uint _ventana
  ) public view returns (Orden[] memory) {
    uint length;
    Orden memory orden;
    uint indiceResultado = 0;
    bytes32 idOrdenSiguiente = 0x00;

    if (ordenes.cantidadActivas < _ventana) {
      length = ordenes.cantidadActivas;
    } else {
      length = _ventana;
    }

    Orden[] memory listado = new Orden[](length);

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
  )
    public
    plataformaActiva
    billeteraActiva
    returns (bool creada, Orden memory)
  {
    bytes32 idOrdenAux;

    // Ningún campo vacío o 0
    require(
      !(emptyString(_tokenCompra) ||
        emptyString(_tokenVenta) ||
        _montoVenta == 0 ||
        (_montoCompra == 0 && _tipo == TipoOrden.COMPRA_VENTA)),
      "O01"
    );

    // Montos válidos
    require(
      _montoVenta > 0 && (_montoCompra > 0 || _tipo != TipoOrden.COMPRA_VENTA),
      "O02"
    );

    // Tokens registrados
    require(
      tokensRegistrados[_tokenCompra].existe &&
        tokensRegistrados[_tokenVenta].existe,
      "T06"
    );

    // Tokens activos
    require(
      tokensRegistrados[_tokenCompra].estado == EstadoGeneral.ACTIVO &&
        tokensRegistrados[_tokenVenta].estado == EstadoGeneral.ACTIVO,
      "O03"
    );

    // Monto mínimo (equivalente en USD)
    uint256 montoUSD;
    {
      // OBS: nuevo scope para evitar errores de pila demasiado profunda
      (int256 cotizacion, uint256 decimalesCotizacion) = consultarCotizacion(
        _tokenVenta
      );
      uint256 decimalesToken = tokensRegistrados[_tokenVenta].decimales;

      montoUSD =
        (uint256(_montoVenta) * uint256(cotizacion)) /
        10 ** (decimalesToken + decimalesCotizacion);
    }

    require(montoUSD >= plataforma.montoMinimoUSD, "O04");

    // Saldo suficiente para la transferencia
    uint256 monto;
    ERC20 contratoToken = ERC20(tokensRegistrados[_tokenVenta].contrato);
    monto = contratoToken.balanceOf(msg.sender);
    require(monto >= _montoVenta, "O05");

    // Credito aprobado suficiente
    monto = contratoToken.allowance(msg.sender, address(this));
    require(monto >= _montoVenta, "O06");

    // Transferir fondos desde el vendedor
    bool respuestaTransferencia = contratoToken.transferFrom(
      msg.sender,
      address(this),
      _montoVenta
    );

    // Revertir transacción si falla el depósito de tokens
    if (!respuestaTransferencia) {
      revert("O07");
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
    if (!billeterasRegistradas[msg.sender].existe) {
      billeterasRegistradas[msg.sender].direccion = msg.sender;
      billeterasRegistradas[msg.sender].rol = RolBilletera.USUARIO;
      billeterasRegistradas[msg.sender].estado = EstadoGeneral.ACTIVO;
      billeterasRegistradas[msg.sender].existe = true;
    }

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

  function ejecutarOrden(
    bytes32 _idOrden
  ) public plataformaActiva billeteraActiva returns (bool exito) {
    Orden storage ordenEjecutada = ordenes.archivo[_idOrden];

    require(ordenEjecutada.existe, "O08");

    // Comprador diferente a vendedor
    require(msg.sender != ordenEjecutada.vendedor, "O09");

    // Vendedor activo
    require(
      billeterasRegistradas[ordenEjecutada.vendedor].estado ==
        EstadoGeneral.ACTIVO,
      "O10"
    );

    // Orden activa
    require(ordenEjecutada.estado == EstadoOrden.ACTIVA, "O11");

    /**************************************************************************/

    if (ordenEjecutada.tipo == TipoOrden.INTERCAMBIO) {
      (
        int256 precioTokenVenta,
        uint8 decimalesPrecioTokenVenta
      ) = consultarCotizacion(ordenEjecutada.tokenVenta);

      (
        int256 precioTokenCompra,
        uint8 decimalesPrecioTokenCompra
      ) = consultarCotizacion(ordenEjecutada.tokenCompra);

      require(precioTokenCompra != 0 && precioTokenVenta != 0, "T07");

      int256 exponenteDecimales;

      {
        uint256 decimalesTokenVenta = tokensRegistrados[
          ordenEjecutada.tokenVenta
        ].decimales;
        uint256 decimalesTokenCompra = tokensRegistrados[
          ordenEjecutada.tokenCompra
        ].decimales;

        unchecked {
          exponenteDecimales = int256(
            decimalesTokenCompra +
              decimalesPrecioTokenCompra -
              decimalesTokenVenta -
              decimalesPrecioTokenVenta
          );
        }
      }

      ordenEjecutada.montoCompra = uint256(
        safeMulExp(
          (int256(ordenEjecutada.montoVenta) * precioTokenVenta) /
            precioTokenCompra,
          exponenteDecimales
        )
      );
    }

    /**************************************************************************/

    // Saldo suficiente para la transferencia
    ERC20 contratoTokenCompra = ERC20(
      tokensRegistrados[ordenEjecutada.tokenCompra].contrato
    );
    uint256 saldo = contratoTokenCompra.balanceOf(msg.sender);
    require(saldo >= ordenEjecutada.montoCompra, "O05");

    // Credito aprobado suficiente
    uint256 credito = contratoTokenCompra.allowance(msg.sender, address(this));
    require(credito >= ordenEjecutada.montoCompra, "O06");

    // Transferir fondos de comprador a vendedor
    bool respuestaTransferencia;
    respuestaTransferencia = contratoTokenCompra.transferFrom(
      msg.sender,
      ordenEjecutada.vendedor,
      ordenEjecutada.montoCompra
    );

    // Revertir transacción si falla el depósito de tokens
    if (!respuestaTransferencia) {
      revert("O12");
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
      revert("O13");
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
    if (!billeterasRegistradas[msg.sender].existe) {
      billeterasRegistradas[msg.sender].direccion = msg.sender;
      billeterasRegistradas[msg.sender].rol = RolBilletera.USUARIO;
      billeterasRegistradas[msg.sender].estado = EstadoGeneral.ACTIVO;
      billeterasRegistradas[msg.sender].existe = true;
    }

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

    // Solo el creador/vendedor puede cancelar su orden
    require(msg.sender == ordenCancelada.vendedor, "O14");

    // Orden activa
    require(ordenCancelada.estado == EstadoOrden.ACTIVA, "O15");

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
      revert("O16");
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

  function buscarOrdenEspejo(
    string memory _tokenCompra,
    string memory _tokenVenta,
    uint256 _montoCompra,
    uint256 _montoVenta
  ) public view returns (Orden memory orden) {
    bytes32 grupoHashGuardado = keccak256(
      abi.encode(_tokenVenta, _tokenCompra, _montoVenta, _montoCompra) // OBS: Orden para consultar (Gemela)
    );

    MapGrupoOrdenHash storage listaGemelas = ordenes.grupos[grupoHashGuardado];

    if (listaGemelas.existe) {
      orden = ordenes.archivo[listaGemelas.idOrdenCabecera];
    }
    return orden;
  }

  function buscarOrden(bytes32 _idOrden) public view returns (Orden memory) {
    Orden storage resultado = ordenes.archivo[_idOrden];
    require(resultado.existe, "O17");
    return resultado;
  }
}
