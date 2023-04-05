// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Datos.sol";
import "./GestorTokens.sol";
import "./GestorBilleteras.sol";
import "./GestorOrdenes.sol";

// import "hardhat/console.sol";

contract Plataforma is Datos, GestorTokens, GestorBilleteras, GestorOrdenes {
  constructor(uint _montoMinimo) {
    plataforma.propietario = msg.sender;
    plataforma.montoMinimoUSD = _montoMinimo;
    plataforma.estado = EstadoGeneral.ACTIVO;

    billeterasRegistradas[msg.sender].existe = true;
    billeterasRegistradas[msg.sender].rol = RolBilletera.PROPIETARIO;
    billeterasRegistradas[msg.sender].estado = EstadoGeneral.ACTIVO;
  }

  function bloquearPlataforma() public soloPropietario returns (bool) {
    require(plataforma.estado == EstadoGeneral.ACTIVO, "P05");

    plataforma.estado = EstadoGeneral.SUSPENDIDO;
    return true;
  }

  function desbloquearPlataforma() public soloPropietario returns (bool) {
    require(plataforma.estado == EstadoGeneral.SUSPENDIDO, "P06");

    plataforma.estado = EstadoGeneral.ACTIVO;
    return true;
  }

  function establecerMontoMinimo(
    uint256 _monto
  ) public soloAdministrador plataformaActiva returns (bool) {
    require(_monto > 0, "P07");

    plataforma.montoMinimoUSD = _monto;
    return true;
  }
}
