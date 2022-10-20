// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Plataforma {

}

// REVIEW: hacer gráficos para entender mejor
struct IndexValue {
  // OBS: tiene el índice en el array
  uint keyIndex; // IMPROVE: representa en qué indice del array está el objeto
  uint value;
}

struct KeyFlag {
  // OBS: tiene la clave en el mapping
  uint key;
  bool deleted;
}

struct itmap {
  mapping(uint => IndexValue) data; // IMPROVE: string => Orden
  KeyFlag[] keys; // IMPROVE: array con los idOrden
  uint size;
}
// IMPROVE: hacer map de map: billetera -> map de ordenes (similar a clave compuesta)

type Iterator is uint;

library IterableMapping {
  function insert(
    itmap storage self,
    uint key, // IMPROVE: idOrden
    uint value // IMPROVE: Orden
  ) internal returns (bool replaced) {
    // WARNING: GIL prestá atención a los nombres
    uint keyIndex = self.data[key].keyIndex; // OBS: revisa si existe
    self.data[key].value = value;
    if (keyIndex > 0) return true;
    // OBS: si existe fue una actualización, sino se debe agregar
    else {
      keyIndex = self.keys.length;
      self.keys.push(); // OBS: abre un espacio (encola en el final) para agregar otro item al array
      self.data[key].keyIndex = keyIndex + 1; // OBS: guarda el valor del indice en el mapping (tiene que ser distinto de cero)
      self.keys[keyIndex].key = key; // OBS: guarda el valor de la clave del map en el array
      self.size++; // OBS: aumenta la cuenta
      return false; // OBS: el false debe ser porque no existía
    }
  }

  function remove(itmap storage self, uint key)
    internal
    returns (bool success)
  {
    uint keyIndex = self.data[key].keyIndex;
    if (keyIndex == 0) return false;
    delete self.data[key];
    self.keys[keyIndex - 1].deleted = true; // OBS: le resta 1 porque en insert le suma 1
    self.size--;
  }

  function contains(itmap storage self, uint key) internal view returns (bool) {
    return self.data[key].keyIndex > 0;
  }

  function iterateStart(itmap storage self) internal view returns (Iterator) {
    return iteratorSkipDeleted(self, 0);
  }

  function iterateValid(itmap storage self, Iterator iterator)
    internal
    view
    returns (bool)
  {
    return Iterator.unwrap(iterator) < self.keys.length;
  }

  function iterateNext(itmap storage self, Iterator iterator)
    internal
    view
    returns (Iterator)
  {
    return iteratorSkipDeleted(self, Iterator.unwrap(iterator) + 1);
  }

  function iterateGet(itmap storage self, Iterator iterator)
    internal
    view
    returns (uint key, uint value)
  {
    uint keyIndex = Iterator.unwrap(iterator);
    key = self.keys[keyIndex].key;
    value = self.data[key].value;
  }

  function iteratorSkipDeleted(itmap storage self, uint keyIndex)
    private
    view
    returns (Iterator)
  {
    while (keyIndex < self.keys.length && self.keys[keyIndex].deleted)
      keyIndex++;
    return Iterator.wrap(keyIndex);
  }
}

// How to use it
contract User {
  // Just a struct holding our data.
  itmap data;
  // Apply library functions to the data type.
  using IterableMapping for itmap;

  // Insert something
  function insert(uint k, uint v) public returns (uint size) {
    // This calls IterableMapping.insert(data, k, v)
    data.insert(k, v);
    // We can still access members of the struct,
    // but we should take care not to mess with them.
    return data.size;
  }

  // Computes the sum of all stored data.
  // REVIEW: Con paginación, este retorno, la función en general puede reducirse en complejidad y tiempo de ejecución
  function sum() public view returns (uint s) {
    for (
      Iterator i = data.iterateStart();
      data.iterateValid(i);
      i = data.iterateNext(i)
    ) {
      (, uint value) = data.iterateGet(i);
      s += value;
    }
  }
}

contract C {
  // The data location of x is storage.
  // This is the only place where the
  // data location can be omitted.
  uint[] x;

  // The data location of memoryArray is memory.
  function f(uint[] memory memoryArray) public {
    x = memoryArray; // works, copies the whole array to storage
    uint[] storage y = x; // works, assigns a pointer, data location of y is storage
    y[7]; // fine, returns the 8th element
    y.pop(); // fine, modifies x through y
    delete x; // fine, clears the array, also modifies y
    // The following does not work; it would need to create a new temporary /
    // unnamed array in storage, but storage is "statically" allocated:
    // y = memoryArray;
    // Similarly, "delete y" is not valid, as assignments to local variables
    // referencing storage objects can only be made from existing storage objects.
    // It would "reset" the pointer, but there is no sensible location it could point to.
    // For more details see the documentation of the "delete" operator.
    // delete y;
    g(x); // calls g, handing over a reference to x
    h(x); // calls h and creates an independent, temporary copy in memory
  }

  function g(uint[] storage) internal pure {}

  function h(uint[] memory) public pure {}
}
