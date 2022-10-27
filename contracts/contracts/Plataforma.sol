// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Plataforma {
  address private propietario;
  uint8 test;
  event AccesoExitoso();

  constructor(uint8 _test) {
    propietario = msg.sender;
    test = _test;
  }

  /****************************************************************************/

  modifier soloPropietario() {
    require(msg.sender == propietario, 'Solo el propietario puede acceder');
    _;
  }

  /****************************************************************************/

  function prueba() public soloPropietario {
    emit AccesoExitoso();
  }
}
