// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Datos.sol";
import "./GestorTokens.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Plataforma is Datos, GestorTokens {
  constructor(uint _montoMinimo) {
    plataforma.propietario = msg.sender;
    plataforma.montoMinimoUSD = _montoMinimo;
    plataforma.estado = EstadoGeneral.ACTIVO;
  }
}
