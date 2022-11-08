// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Datos.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract GestorTokens is Datos {
  /**
   * @notice listar tokens que cumplan los criterios de búsqueda
   * @param _incluirSuspendidos determina si solo se listan los tokens activos
   * @return resultado array de tokens (activos o todos, según corresponda)
   * @dev si ticker viene vacío, lista todo (dependiendo de si incluye solo activos)
   */
  function listarTokens(bool _incluirSuspendidos)
    public
    view
    returns (Token[] memory)
  {
    Token memory token;
    Token[] memory resultado = new Token[](tokensArray.length); // IMPROVE: sería más óptimo tener la cantidad exacta de elementos activos
    uint indiceResultado = 0;

    for (uint index = 0; index < tokensArray.length; index++) {
      token = tokensMap[tokensArray[index]];

      if (
        token.existe && // OBS: se hace para que no incluya el elemento default del map
        (_incluirSuspendidos || token.estado == EstadoGeneral.ACTIVO)
      ) {
        resultado[indiceResultado] = token;
        indiceResultado++;
      }
    }

    return resultado; // WARNING: Está devolviendo lo siguiente cuando soloActivos va en false
    // [MATIC,0x0000000000000000000000000000000000001010,0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada,18,0,true]
    // [WETH,0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa,0x0715A7794a1dc8e42615F059dD6e406A6594651A,18,0,true]
    // [,0x0000000000000000000000000000000000000000,0x0000000000000000000000000000000000000000,0,0,false]
    // WARNING: y esto cuando va en true
    // [MATIC,0x0000000000000000000000000000000000001010,0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada,18,0,true]
    // [WETH,0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa,0x0715A7794a1dc8e42615F059dD6e406A6594651A,18,0,true]
    // [DAI,0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253,0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046,18,1,true]
  }

  /**
   * @notice crear nuevo token
   * @param _contrato dirección del contrato del token
   * @param _oraculo dirección del contrato de cotización del token
   * @return creado array de tokens que cumplan los criterios de búsqueda
   */
  function nuevoToken(address _contrato, address _oraculo)
    public
    soloAdministrador
    returns (bool)
  {
    uint256 size;
    assembly {
      size := extcodesize(_contrato) // OBS: es para ayudar determinar la validez de la dirección
    }
    require(size > 0, "La direccion del contrato es invalida");

    assembly {
      size := extcodesize(_oraculo)
    }
    require(size > 0, "La direccion del oraculo es invalida");
    require(
      _oraculo != address(0),
      "La direccion del oraculo no puede ser cero"
    );

    ERC20 contratoToken = ERC20(_contrato);
    string memory ticker = contratoToken.symbol();

    require(
      !tokensMap[ticker].existe,
      "El token ya esta registrado en la plataforma"
    );

    tokensMap[ticker].ticker = contratoToken.symbol();
    tokensMap[ticker].decimales = contratoToken.decimals();
    tokensMap[ticker].contrato = _contrato;
    tokensMap[ticker].oraculo = _oraculo;
    tokensMap[ticker].estado = EstadoGeneral.ACTIVO;
    tokensMap[ticker].existe = true;

    tokensArray.push(ticker);

    console.log(tokensArray[tokensArray.length - 1]);

    return true;
  }

  /**
   * @notice establece el oraculo de un token
   * @param _ticker nombre del token
   * @param _oraculo dirección del oráculo
   * @return resultado indica el resultado de la operación
   */
  function modifcarOraculo(string memory _ticker, address _oraculo)
    public
    soloAdministrador
    returns (bool resultado)
  {
    resultado = false;

    require(tokensMap[_ticker].existe, "El token ingresado no esta registrado");

    uint256 size;
    assembly {
      size := extcodesize(_oraculo)
    }
    require(size > 0, "La direccion del oraculo es invalida");
    require(
      _oraculo != address(0),
      "La direccion del oraculo no puede ser cero"
    );

    tokensMap[_ticker].oraculo = _oraculo;
    resultado = true;
  }

  /**
   * @notice suspende un token
   * @param _ticker nombre del token
   * @return resultado indica el resultado de la operación
   * @dev borrado lógico
   */
  function suspenderToken(string memory _ticker)
    public
    soloAdministrador
    returns (bool resultado)
  {
    resultado = false;

    require(tokensMap[_ticker].existe, "El token ingresado no esta registrado");

    tokensMap[_ticker].estado = EstadoGeneral.SUSPENDIDO;
    resultado = true;
  }

  /**
   * @notice activa un token
   * @param _ticker nombre del token
   * @return resultado indica el resultado de la operación
   */
  function activarToken(string memory _ticker)
    public
    soloAdministrador
    returns (bool resultado)
  {
    resultado = false;

    require(tokensMap[_ticker].existe, "El token ingresado no esta registrado");

    tokensMap[_ticker].estado = EstadoGeneral.ACTIVO;
    resultado = true;
  }

  /**
   * @notice consultar la cotización del token en base al ticker
   * @param _ticker nombre del token a buscar (único en la blockchain)
   * @return precio precio del token en base al oráculo
   */
  function consultarCotizacion(string memory _ticker)
    public
    view
    returns (int256 precio)
  {
    require(tokensMap[_ticker].existe, "El token ingresado no esta registrado");

    AggregatorV3Interface oraculo = AggregatorV3Interface(
      tokensMap[_ticker].oraculo
    );
    (
      ,
      int256 price, // valor en usd (depende del token)
      ,
      ,

    ) = oraculo.latestRoundData();

    precio = price;

    // IMPROVE: usar este código para controlar el monto mínimo
    // require(
    //   (uint256(_amount) * uint256(price)) /
    //     10**uint256(nativeTokenParams.decimals) >=
    //     platformContract.minWithdrawUsd,
    //   "Amount in usd must be greater than the min"
    // );
  }
}
