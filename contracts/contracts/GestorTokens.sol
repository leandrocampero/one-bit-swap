// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Datos.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GestorTokens is Datos {
  /**
   * @notice listar tokens que cumplan los criterios de búsqueda
   * @param _ticker nombre del token a buscar (único en la blockchain)
   * @param _soloActivos determina si solo se listan los tokens activos
   * @return resultado array de tokens que cumplan los criterios de búsqueda
   * @dev si ticker viene vacío, lista todo (dependiendo de si incluye solo activos)
   */
  function buscarTokens(string memory _ticker, bool _soloActivos)
    public
    view
    returns (Token[] memory resultado)
  {
    Token memory token;
    if (!emptyString(_ticker)) {
      token = tokensMap[_ticker];
      require(token.existe, "El token no existe");
      resultado[0] = token;
    } else {
      for (uint index = 0; index < tokensArray.length; index++) {
        token = tokensMap[tokensArray[index]];

        if (_soloActivos && token.estado == EstadoGeneral.ACTIVO) {
          resultado[index] = token;
        }
      }
    }

    return resultado;
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

    return true;
  }
}
