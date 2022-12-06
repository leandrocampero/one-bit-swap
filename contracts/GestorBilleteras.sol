// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Datos.sol";

// import "hardhat/console.sol";

contract GestorBilleteras is Datos {
  /**
   * @notice lista todos los administradores
   * @return listado array de billeteras con rol administrador
   */
  // REVIEW: ¿Se puede hacer paginado?
  function listarAdministradores() public view returns (Billetera[] memory) {
    Billetera memory billetera;
    Billetera[] memory listado = new Billetera[](
      billeterasAdministradores.length
    );
    uint indiceResultado = 0;

    for (uint index = 0; index < billeterasAdministradores.length; index++) {
      billetera = billeterasRegistradas[billeterasAdministradores[index]];

      if (billetera.existe) {
        listado[indiceResultado] = billetera;
        indiceResultado++;
      }
    }

    return listado;
  }

  /**
   * @notice convertir una billetera en administrador
   * @param _billetera dirección de la billetera a convertr
   * @return modificado indica si la operación fué exitosa o no
   * @dev si la billetera no existe, la registra con rol administrador
   */
  function hacerAdministrador(address _billetera)
    public
    soloPropietario
    returns (bool modificado)
  {
    modificado = false;
    uint256 size;

    assembly {
      size := extcodesize(_billetera)
    }
    require(size > 0, "La billetera es invalida");
    require(
      _billetera != address(0),
      "La direccion de la billetera no puede ser cero"
    );

    if (billeterasRegistradas[_billetera].rol == RolBilletera.ADMINISTRADOR) {
      return modificado;
    }

    billeterasRegistradas[_billetera].rol = RolBilletera.ADMINISTRADOR;

    billeterasAdministradores.push(_billetera);
    billeterasRegistradas[_billetera].indiceAdmin =
      billeterasAdministradores.length -
      1;

    if (!billeterasRegistradas[_billetera].existe) {
      billeterasRegistradas[_billetera].existe = true;
      billeterasRegistradas[_billetera].direccion = _billetera;
      billeterasRegistradas[_billetera].estado = EstadoGeneral.ACTIVO;
    }

    modificado = true;

    return modificado;
  }

  /**
   * @notice eliminar una billetera de los administradores
   * @param _billetera dirección de la billetera a convertr
   * @return modificado indica si la operación fué exitosa o no
   * @dev se debe controlar que la billetera exista, sino no tiene sentido quitar rol
   */
  function quitarAdministrador(address _billetera)
    public
    soloPropietario
    returns (bool modificado)
  {
    modificado = false;
    uint256 size;

    assembly {
      size := extcodesize(_billetera)
    }
    require(size > 0, "La billetera es invalida");
    require(
      _billetera != address(0),
      "La direccion de la billetera no puede ser cero"
    );

    require(billeterasRegistradas[_billetera].existe, "La billetera no existe");

    if (billeterasRegistradas[_billetera].rol == RolBilletera.USUARIO) {
      return modificado;
    }

    billeterasRegistradas[_billetera].rol = RolBilletera.USUARIO;
    uint index = billeterasRegistradas[_billetera].indiceAdmin;

    if (index != billeterasAdministradores.length - 1) {
      address reemplazo = billeterasAdministradores[
        billeterasAdministradores.length - 1
      ];

      billeterasAdministradores[index] = reemplazo;

      billeterasRegistradas[reemplazo].indiceAdmin = index;
    }

    billeterasRegistradas[_billetera].indiceAdmin = 0;
    billeterasAdministradores.pop();

    modificado = true;

    return modificado;
  }

  /**
   * @notice lista todas las billeteras bloqueadas
   * @return listado array de billeteras con estado bloqueado
   */
  function listarBilleterasBloqueadas()
    public
    view
    returns (Billetera[] memory)
  {
    Billetera memory billetera;
    Billetera[] memory listado = new Billetera[](billeterasBloqueadas.length);
    uint indiceResultado = 0;

    for (uint index = 0; index < billeterasBloqueadas.length; index++) {
      billetera = billeterasRegistradas[billeterasBloqueadas[index]];

      if (billetera.existe) {
        listado[indiceResultado] = billetera;
        indiceResultado++;
      }
    }

    return listado;
  }

  /**
   * @notice bloquear una billetera
   * @param _billetera dirección de la billetera a bloquear
   * @return modificado indica si la operación fué exitosa o no
   * @dev si la billetera no existe, la registra bloqueada con rol usuario
   */
  function bloquearBilletera(address _billetera)
    public
    soloAdministrador
    returns (bool modificado)
  {
    modificado = false;
    uint256 size;

    assembly {
      size := extcodesize(_billetera)
    }
    require(size > 0, "La billetera es invalida");
    require(
      _billetera != address(0),
      "La direccion de la billetera no puede ser cero"
    );

    if (billeterasRegistradas[_billetera].estado == EstadoGeneral.SUSPENDIDO) {
      return modificado;
    }

    billeterasRegistradas[_billetera].estado = EstadoGeneral.SUSPENDIDO;

    billeterasBloqueadas.push(_billetera);
    billeterasRegistradas[_billetera].indiceBloqueado =
      billeterasBloqueadas.length -
      1;

    if (!billeterasRegistradas[_billetera].existe) {
      billeterasRegistradas[_billetera].existe = true;
      billeterasRegistradas[_billetera].direccion = _billetera;
      billeterasRegistradas[_billetera].rol = RolBilletera.USUARIO;
    }

    modificado = true;

    return modificado;
  }

  /**
   * @notice desbloquear una billetera
   * @param _billetera dirección de la billetera a desbloquear
   * @return modificado indica si la operación fué exitosa o no
   * @dev se debe controlar que la billetera exista, sino no tiene sentido desbloquear
   */
  function desbloquearBilletera(address _billetera)
    public
    soloAdministrador
    returns (bool modificado)
  {
    modificado = false;
    uint256 size;

    assembly {
      size := extcodesize(_billetera)
    }
    require(size > 0, "La billetera es invalida");
    require(
      _billetera != address(0),
      "La direccion de la billetera no puede ser cero"
    );

    require(billeterasRegistradas[_billetera].existe, "La billetera no existe");

    if (billeterasRegistradas[_billetera].estado == EstadoGeneral.ACTIVO) {
      return modificado;
    }

    billeterasRegistradas[_billetera].estado = EstadoGeneral.ACTIVO;
    uint index = billeterasRegistradas[_billetera].indiceBloqueado;

    if (index != billeterasBloqueadas.length - 1) {
      address reemplazo = billeterasBloqueadas[billeterasBloqueadas.length - 1];

      billeterasBloqueadas[index] = reemplazo;

      billeterasRegistradas[reemplazo].indiceBloqueado = index;
    }

    billeterasRegistradas[_billetera].indiceBloqueado = 0;
    billeterasBloqueadas.pop();

    modificado = true;

    return modificado;
  }
}
