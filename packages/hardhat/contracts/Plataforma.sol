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
  }

  function bloquearPlataforma() public soloAdministrador returns (bool) {
    require(
      plataforma.estado == EstadoGeneral.ACTIVO,
      "La plataforma ya se encuentra bloqueada"
    );

    plataforma.estado = EstadoGeneral.SUSPENDIDO;
    return true;
  }

  function desbloquearPlataforma() public soloAdministrador returns (bool) {
    require(
      plataforma.estado == EstadoGeneral.SUSPENDIDO,
      "La plataforma ya se encuentra activa"
    );

    plataforma.estado = EstadoGeneral.ACTIVO;
    return true;
  }

  function establecerMontoMinimo(
    uint256 _monto
  ) public soloAdministrador plataformaActiva returns (bool) {
    require(_monto > 0, "El monto nuevo no puede ser cero");

    plataforma.montoMinimoUSD = _monto;
    return true;
  }
}
