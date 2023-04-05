// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Datos.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// import "hardhat/console.sol";

contract GestorTokens is Datos {
  /**
   * @notice listar tokens que cumplan los criterios de búsqueda
   * @param _incluirSuspendidos determina si solo se listan los tokens activos
   * @return resultado array de tokens (activos o todos, según corresponda)
   * @dev si ticker viene vacío, lista todo (dependiendo de si incluye solo activos)
   */
  function listarTokens(
    bool _incluirSuspendidos
  ) public view returns (Token[] memory) {
    Token memory token;
    uint length;

    if (_incluirSuspendidos) {
      length = tokensCantidadTotal;
    } else {
      length = tokensCantidadActivos;
    }

    Token[] memory resultado = new Token[](length);
    uint indiceResultado = 0;

    for (uint index = 0; index < tokensListado.length; index++) {
      token = tokensRegistrados[tokensListado[index]];

      if (
        token.existe && // OBS: se hace para que no incluya el elemento default del map
        (_incluirSuspendidos || token.estado == EstadoGeneral.ACTIVO)
      ) {
        resultado[indiceResultado] = token;
        indiceResultado++;
      }
    }

    return resultado;
  }

  /**
   * @notice crear nuevo token
   * @param _contrato dirección del contrato del token
   * @param _oraculo dirección del contrato de cotización del token
   * @return creado indica si la creación fue exitosa o no
   */
  function nuevoToken(
    address _contrato,
    address _oraculo
  ) public soloAdministrador returns (bool) {
    uint256 size;
    assembly {
      size := extcodesize(_contrato) // OBS: es para ayudar determinar la validez de la dirección
    }
    require(size > 0, "T01");

    assembly {
      size := extcodesize(_oraculo)
    }
    require(size > 0, "T02");
    require(_oraculo != address(0), "T03");

    ERC20 contratoToken = ERC20(_contrato);
    string memory ticker = contratoToken.symbol();

    require(!tokensRegistrados[ticker].existe, "T04");

    tokensRegistrados[ticker].ticker = contratoToken.symbol();
    tokensRegistrados[ticker].decimales = contratoToken.decimals();
    tokensRegistrados[ticker].contrato = _contrato;
    tokensRegistrados[ticker].oraculo = _oraculo;
    tokensRegistrados[ticker].estado = EstadoGeneral.ACTIVO;
    tokensRegistrados[ticker].existe = true;

    tokensListado.push(ticker);
    tokensCantidadActivos++;
    tokensCantidadTotal++;
    emit NuevoToken(tokensRegistrados[ticker]);

    return true;
  }

  /**
   * @notice establece el oraculo de un token
   * @param _ticker nombre del token
   * @param _oraculo dirección del oráculo
   * @return resultado indica el resultado de la operación
   */
  function modifcarOraculo(
    string memory _ticker,
    address _oraculo
  ) public soloAdministrador returns (bool resultado) {
    resultado = false;

    require(tokensRegistrados[_ticker].existe, "T05");

    uint256 size;
    assembly {
      size := extcodesize(_oraculo)
    }
    require(size > 0, "T02");
    require(_oraculo != address(0), "T03");

    tokensRegistrados[_ticker].oraculo = _oraculo;
    resultado = true;
  }

  /**
   * @notice suspende un token
   * @param _ticker nombre del token
   * @return resultado indica el resultado de la operación
   * @dev borrado lógico
   */
  function suspenderToken(
    string memory _ticker
  ) public soloAdministrador returns (bool resultado) {
    resultado = false;

    require(tokensRegistrados[_ticker].existe, "T05");

    tokensRegistrados[_ticker].estado = EstadoGeneral.SUSPENDIDO;
    tokensCantidadActivos--;
    resultado = true;
  }

  /**
   * @notice activa un token
   * @param _ticker nombre del token
   * @return resultado indica el resultado de la operación
   */
  function activarToken(
    string memory _ticker
  ) public soloAdministrador returns (bool resultado) {
    resultado = false;

    require(tokensRegistrados[_ticker].existe, "T05");

    tokensRegistrados[_ticker].estado = EstadoGeneral.ACTIVO;
    tokensCantidadActivos++;
    resultado = true;
  }

  /**
   * @notice consultar la cotización del token en base al ticker
   * @param _ticker nombre del token a buscar (único en la blockchain)
   * @return precio precio del token en base al oráculo
   * @return decimales cantidad de decimales de la cotización
   */
  function consultarCotizacion(
    string memory _ticker
  ) public view returns (int256 precio, uint8 decimales) {
    require(tokensRegistrados[_ticker].existe, "T05");

    AggregatorV3Interface oraculo = AggregatorV3Interface(
      tokensRegistrados[_ticker].oraculo
    );
    (
      ,
      precio, // valor en usd (depende del token)
      ,
      ,

    ) = oraculo.latestRoundData();
    decimales = oraculo.decimals();
  }

  /**
   * @notice consultar la cotización del monto a intercambiar del token compra
   * @param _tokenVenta nombre del token a vender (único en la blockchain)
   * @param _tokenCompra nombre del token a comprar (único en la blockchain)
   * @param _montoVenta monto del token a vender (único en la blockchain)
   * @return montoCompra monto del del token a comprar en base al oráculo
   */
  function consultarMontoCotizado(
    string memory _tokenVenta,
    string memory _tokenCompra,
    uint256 _montoVenta
  ) public view returns (uint256 montoCompra) {
    // Tokens registrados
    require(
      tokensRegistrados[_tokenCompra].existe &&
        tokensRegistrados[_tokenVenta].existe,
      "T06"
    );

    (
      int256 precioTokenVenta,
      uint8 decimalesPrecioTokenVenta
    ) = consultarCotizacion(_tokenVenta);

    (
      int256 precioTokenCompra,
      uint8 decimalesPrecioTokenCompra
    ) = consultarCotizacion(_tokenCompra);

    require(precioTokenCompra != 0 && precioTokenVenta != 0, "T07");

    int256 exponenteDecimales;

    {
      uint256 decimalesTokenVenta = tokensRegistrados[_tokenVenta].decimales;
      uint256 decimalesTokenCompra = tokensRegistrados[_tokenCompra].decimales;

      unchecked {
        exponenteDecimales = int256(
          decimalesTokenCompra +
            decimalesPrecioTokenCompra -
            decimalesTokenVenta -
            decimalesPrecioTokenVenta
        );
      }
    }

    montoCompra = uint256(
      safeMulExp(
        (int256(_montoVenta) * precioTokenVenta) / precioTokenCompra,
        exponenteDecimales
      )
    );
  }
}
