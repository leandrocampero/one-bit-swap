// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Datos.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Plataforma is Datos {
  constructor(uint _montoMinimo) {
    plataforma.propietario = msg.sender;
    plataforma.montoMinimoUSD = _montoMinimo;
    plataforma.estado = EstadoGeneral.ACTIVO;
  }

  /****************************************************************************/

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
    if (emptyString(_ticker)) {
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
}
