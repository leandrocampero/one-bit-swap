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

    // REVIEW: cargando primeros tokens de prueba
    nuevoToken(
      0x0000000000000000000000000000000000001010,
      0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
    ); // MATIC

    nuevoToken(
      0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa,
      0x0715A7794a1dc8e42615F059dD6e406A6594651A
    ); // ETH

    nuevoToken(
      0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253,
      0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046
    ); // DAI

    suspenderToken("DAI");
  }
}
