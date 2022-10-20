// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Plataforma {
  // IMPROVE: La primera versión es rancia, empeza con algo. No podes resolver todo en la primera
  // REVIEW: Usar REMIX
  address private propietario;
  event AccesoExitoso();

  constructor() {
    console.log("Direccion del propietario: ", msg.sender);

    propietario = msg.sender;
  }

  /****************************************************************************/

  modifier soloPropietario() {
    require(msg.sender == propietario, "Solo el propietario puede acceder");
    _;
  }

  /****************************************************************************/

  function prueba() public soloPropietario {
    emit AccesoExitoso();
  }
}
