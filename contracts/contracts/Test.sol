// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Pruebas {
  struct Tipo {
    uint valor;
    bool existe;
  }

  mapping(uint => Tipo) mapa;
  uint[] array;

  function listar(bool _soloActivos) public view returns (Tipo[] memory) {
    Tipo[] memory nuevoArray = new Tipo[](array.length);
    Tipo memory elemento;
    uint nuevoContador = 0;

    console.log("Prueba: ", array[0]);
    for (uint index = 0; index < array.length; index++) {
      elemento = mapa[array[index]];
      console.log("Elemento: ", elemento.valor);

      if (_soloActivos || elemento.existe) {
        nuevoArray[nuevoContador] = elemento;
        nuevoContador++;
        console.log("Se agrega!");
      }
    }

    return nuevoArray;
  }

  function tamanio() public view returns (uint256) {
    return array.length;
  }

  function getArray() public view returns (uint[] memory) {
    return array;
  }

  constructor() {
    Tipo memory var1;
    Tipo memory var2;
    Tipo memory var3;
    Tipo memory var4;

    var1.valor = 1;
    var1.existe = true;
    var2.valor = 2;
    var2.existe = true;
    var3.valor = 3;
    var3.existe = false;
    var4.valor = 4;
    var4.existe = true;

    array.push(var1.valor);
    array.push(var2.valor);
    array.push(var3.valor);
    array.push(var4.valor);

    mapa[var1.valor] = var1;
    mapa[var2.valor] = var2;
    mapa[var3.valor] = var3;
    mapa[var4.valor] = var4;
  }
}
