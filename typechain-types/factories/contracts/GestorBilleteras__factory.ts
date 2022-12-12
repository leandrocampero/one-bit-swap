/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  GestorBilleteras,
  GestorBilleterasInterface,
} from "../../contracts/GestorBilleteras";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "idOrden",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "siguienteOrdenActiva",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "anteriorOrdenActiva",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "siguienteOrdenGemela",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "anteriorOrdenGemela",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "vendedor",
            type: "address",
          },
          {
            internalType: "address",
            name: "comprador",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "montoVenta",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "montoCompra",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fechaCreacion",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fechaFinalizacion",
            type: "uint256",
          },
          {
            internalType: "enum Datos.EstadoOrden",
            name: "estado",
            type: "uint8",
          },
          {
            internalType: "enum Datos.TipoOrden",
            name: "tipo",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "existe",
            type: "bool",
          },
          {
            internalType: "string",
            name: "tokenCompra",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenVenta",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct Datos.Orden",
        name: "respuesta",
        type: "tuple",
      },
    ],
    name: "NuevaOrden",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "direccion",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "indiceAdmin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "indiceBloqueado",
            type: "uint256",
          },
          {
            internalType: "enum Datos.RolBilletera",
            name: "rol",
            type: "uint8",
          },
          {
            internalType: "enum Datos.EstadoGeneral",
            name: "estado",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "existe",
            type: "bool",
          },
          {
            internalType: "string[]",
            name: "ordenes",
            type: "string[]",
          },
        ],
        indexed: false,
        internalType: "struct Datos.Billetera",
        name: "respuesta",
        type: "tuple",
      },
    ],
    name: "NuevoAdministrador",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ticker",
            type: "string",
          },
          {
            internalType: "address",
            name: "contrato",
            type: "address",
          },
          {
            internalType: "address",
            name: "oraculo",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "decimales",
            type: "uint8",
          },
          {
            internalType: "enum Datos.EstadoGeneral",
            name: "estado",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "existe",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct Datos.Token",
        name: "respuesta",
        type: "tuple",
      },
    ],
    name: "NuevoToken",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_billetera",
        type: "address",
      },
    ],
    name: "bloquearBilletera",
    outputs: [
      {
        internalType: "bool",
        name: "modificado",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_billetera",
        type: "address",
      },
    ],
    name: "desbloquearBilletera",
    outputs: [
      {
        internalType: "bool",
        name: "modificado",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_string",
        type: "string",
      },
    ],
    name: "emptyString",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_billetera",
        type: "address",
      },
    ],
    name: "hacerAdministrador",
    outputs: [
      {
        internalType: "bool",
        name: "modificado",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "listarAdministradores",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "direccion",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "indiceAdmin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "indiceBloqueado",
            type: "uint256",
          },
          {
            internalType: "enum Datos.RolBilletera",
            name: "rol",
            type: "uint8",
          },
          {
            internalType: "enum Datos.EstadoGeneral",
            name: "estado",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "existe",
            type: "bool",
          },
          {
            internalType: "string[]",
            name: "ordenes",
            type: "string[]",
          },
        ],
        internalType: "struct Datos.Billetera[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "listarBilleterasBloqueadas",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "direccion",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "indiceAdmin",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "indiceBloqueado",
            type: "uint256",
          },
          {
            internalType: "enum Datos.RolBilletera",
            name: "rol",
            type: "uint8",
          },
          {
            internalType: "enum Datos.EstadoGeneral",
            name: "estado",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "existe",
            type: "bool",
          },
          {
            internalType: "string[]",
            name: "ordenes",
            type: "string[]",
          },
        ],
        internalType: "struct Datos.Billetera[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ordenes",
    outputs: [
      {
        internalType: "uint256",
        name: "cantidadTotal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cantidadActivas",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "ultimaOrdenActiva",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "plataforma",
    outputs: [
      {
        internalType: "enum Datos.EstadoGeneral",
        name: "estado",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "propietario",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "montoMinimoUSD",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_billetera",
        type: "address",
      },
    ],
    name: "quitarAdministrador",
    outputs: [
      {
        internalType: "bool",
        name: "modificado",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "tokensRegistrados",
    outputs: [
      {
        internalType: "string",
        name: "ticker",
        type: "string",
      },
      {
        internalType: "address",
        name: "contrato",
        type: "address",
      },
      {
        internalType: "address",
        name: "oraculo",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "decimales",
        type: "uint8",
      },
      {
        internalType: "enum Datos.EstadoGeneral",
        name: "estado",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "existe",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506116ad806100206000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80634bd368c8116100665780634bd368c8146101335780634ec7e00d146101465780637debf02a14610159578063c7b55d921461017e578063fb2f1a891461018657600080fd5b8063092e6f08146100a357806320f340bc146100cb578063366226c4146100de57806349668238146100f15780634a884e1f1461011e575b600080fd5b6100b66100b13660046111ac565b6101b7565b60405190151581526020015b60405180910390f35b6100b66100d93660046111ac565b6104af565b6100b66100ec3660046111ac565b610714565b60055460065460075461010392919083565b604080519384526020840192909252908201526060016100c2565b610126610982565b6040516100c291906112b1565b6100b661014136600461138e565b511590565b6100b66101543660046111ac565b610c09565b61016c61016736600461138e565b610e0f565b6040516100c29695949392919061143f565b610126610ef1565b6000546001546101a89160ff8116916101009091046001600160a01b03169083565b6040516100c293929190611496565b336000908152600b602052604081206003015462010000900460ff16801561020557506001336000908152600b602052604090206003015460ff166001811115610203576102036111dc565b145b8061021f575060005461010090046001600160a01b031633145b6102445760405162461bcd60e51b815260040161023b906114c0565b60405180910390fd5b506000813b80156102675760405162461bcd60e51b815260040161023b90611503565b6001600160a01b03831661028d5760405162461bcd60e51b815260040161023b9061153a565b6001600160a01b0383166000908152600b602052604090206003015462010000900460ff166102f75760405162461bcd60e51b81526020600482015260166024820152754c612062696c6c6574657261206e6f2065786973746560501b604482015260640161023b565b60016001600160a01b0384166000908152600b6020526040902060030154610100900460ff16600181111561032e5761032e6111dc565b146103875760405162461bcd60e51b815260206004820152602360248201527f4c612062696c6c657465726120796120736520656e6375656e7472612061637460448201526269766160e81b606482015260840161023b565b6001600160a01b0383166000908152600b6020526040902060038101805461ff001916905560020154600c546103bf9060019061159e565b811461045657600c8054600091906103d99060019061159e565b815481106103e9576103e96115b7565b600091825260209091200154600c80546001600160a01b039092169250829184908110610418576104186115b7565b600091825260208083209190910180546001600160a01b0319166001600160a01b03948516179055929091168152600b909152604090206002018190555b6001600160a01b0384166000908152600b6020526040812060020155600c805480610483576104836115cd565b600082815260209020600019908201810180546001600160a01b03191690550190555060019392505050565b336000908152600b602052604081206003015462010000900460ff1680156104fd57506001336000908152600b602052604090206003015460ff1660018111156104fb576104fb6111dc565b145b80610517575060005461010090046001600160a01b031633145b6105335760405162461bcd60e51b815260040161023b906114c0565b506000813b80156105565760405162461bcd60e51b815260040161023b90611503565b6001600160a01b03831661057c5760405162461bcd60e51b815260040161023b9061153a565b60006001600160a01b0384166000908152600b6020526040902060030154610100900460ff1660018111156105b3576105b36111dc565b1461060f5760405162461bcd60e51b815260206004820152602660248201527f4c612062696c6c657465726120796120736520656e6375656e74726120626c6f60448201526571756561646160d01b606482015260840161023b565b6001600160a01b0383166000818152600b60205260408120600301805461ff001916610100179055600c805460018181018355928290527fdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c70180546001600160a01b0319169093179092559054610686919061159e565b6001600160a01b0384166000908152600b6020526040902060028101919091556003015462010000900460ff1661070b576001600160a01b0383166000818152600b602052604081206003810180546201000062ff00001982168117835583546001600160a01b031916909517909255919262ff00ff19909116176001835b02179055505b50600192915050565b6000805461010090046001600160a01b031633146107445760405162461bcd60e51b815260040161023b906115e3565b506000813b80156107675760405162461bcd60e51b815260040161023b90611503565b6001600160a01b03831661078d5760405162461bcd60e51b815260040161023b9061153a565b6001600160a01b0383166000908152600b602052604090206003015462010000900460ff166107f75760405162461bcd60e51b81526020600482015260166024820152754c612062696c6c6574657261206e6f2065786973746560501b604482015260640161023b565b60016001600160a01b0384166000908152600b602052604090206003015460ff166001811115610829576108296111dc565b146108865760405162461bcd60e51b815260206004820152602760248201527f4c612062696c6c6574657261206e6f207469656e6520726f6c2061646d696e6960448201526639ba3930b237b960c91b606482015260840161023b565b6001600160a01b0383166000908152600b6020526040902060038101805460ff19169055600190810154600d5490916108be9161159e565b811461095557600d8054600091906108d89060019061159e565b815481106108e8576108e86115b7565b600091825260209091200154600d80546001600160a01b039092169250829184908110610917576109176115b7565b600091825260208083209190910180546001600160a01b0319166001600160a01b03948516179055929091168152600b909152604090206001018190555b6001600160a01b0384166000908152600b6020526040812060010155600d805480610483576104836115cd565b606061098c61116f565b600d5460009067ffffffffffffffff8111156109aa576109aa611378565b6040519080825280602002602001820160405280156109e357816020015b6109d061116f565b8152602001906001900390816109c85790505b5090506000805b600d54811015610c0057600b6000600d8381548110610a0b57610a0b6115b7565b60009182526020808320909101546001600160a01b039081168452838201949094526040928301909120825160e08101845281549094168452600181810154928501929092526002810154928401929092526003820154606084019160ff90911690811115610a7c57610a7c6111dc565b6001811115610a8d57610a8d6111dc565b81526020016003820160019054906101000a900460ff166001811115610ab557610ab56111dc565b6001811115610ac657610ac66111dc565b8152600382015462010000900460ff161515602080830191909152600483018054604080518285028101850182528281529401939260009084015b82821015610bad578382906000526020600020018054610b2090611624565b80601f0160208091040260200160405190810160405280929190818152602001828054610b4c90611624565b8015610b995780601f10610b6e57610100808354040283529160200191610b99565b820191906000526020600020905b815481529060010190602001808311610b7c57829003601f168201915b505050505081526020019060010190610b01565b505050508152505093508360a0015115610bee5783838381518110610bd457610bd46115b7565b60200260200101819052508180610bea9061165e565b9250505b80610bf88161165e565b9150506109ea565b50909392505050565b6000805461010090046001600160a01b03163314610c395760405162461bcd60e51b815260040161023b906115e3565b506000813b8015610c5c5760405162461bcd60e51b815260040161023b90611503565b6001600160a01b038316610c825760405162461bcd60e51b815260040161023b9061153a565b60016001600160a01b0384166000908152600b602052604090206003015460ff166001811115610cb457610cb46111dc565b03610d145760405162461bcd60e51b815260206004820152602a60248201527f4c612062696c6c6574657261207961207469656e6520726f6c2064652061646d60448201526934b734b9ba3930b237b960b11b606482015260840161023b565b6001600160a01b0383166000818152600b60205260408120600301805460ff19166001908117909155600d80548083018255928190527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb590920180546001600160a01b03191690931790925554610d8b919061159e565b6001600160a01b0384166000908152600b6020526040902060018101919091556003015462010000900460ff1661070b576001600160a01b0383166000818152600b602052604081206003810180546201000062ff00001982168117835583546001600160a01b031916909517909255919262ffff00199091161761010083610705565b8051602081830181018051600882529282019190930120915280548190610e3590611624565b80601f0160208091040260200160405190810160405280929190818152602001828054610e6190611624565b8015610eae5780601f10610e8357610100808354040283529160200191610eae565b820191906000526020600020905b815481529060010190602001808311610e9157829003601f168201915b505050600184015460029094015492936001600160a01b0390811693908116925060ff600160a01b820481169250600160a81b8204811691600160b01b90041686565b6060610efb61116f565b600c5460009067ffffffffffffffff811115610f1957610f19611378565b604051908082528060200260200182016040528015610f5257816020015b610f3f61116f565b815260200190600190039081610f375790505b5090506000805b600c54811015610c0057600b6000600c8381548110610f7a57610f7a6115b7565b60009182526020808320909101546001600160a01b039081168452838201949094526040928301909120825160e08101845281549094168452600181810154928501929092526002810154928401929092526003820154606084019160ff90911690811115610feb57610feb6111dc565b6001811115610ffc57610ffc6111dc565b81526020016003820160019054906101000a900460ff166001811115611024576110246111dc565b6001811115611035576110356111dc565b8152600382015462010000900460ff161515602080830191909152600483018054604080518285028101850182528281529401939260009084015b8282101561111c57838290600052602060002001805461108f90611624565b80601f01602080910402602001604051908101604052809291908181526020018280546110bb90611624565b80156111085780601f106110dd57610100808354040283529160200191611108565b820191906000526020600020905b8154815290600101906020018083116110eb57829003601f168201915b505050505081526020019060010190611070565b505050508152505093508360a001511561115d5783838381518110611143576111436115b7565b602002602001018190525081806111599061165e565b9250505b806111678161165e565b915050610f59565b6040805160e08101825260008082526020820181905291810182905290606082019081526020016000815260006020820152606060409091015290565b6000602082840312156111be57600080fd5b81356001600160a01b03811681146111d557600080fd5b9392505050565b634e487b7160e01b600052602160045260246000fd5b6002811061121057634e487b7160e01b600052602160045260246000fd5b50565b6000815180845260005b818110156112395760208185018101518683018201520161121d565b506000602082860101526020601f19601f83011685010191505092915050565b600082825180855260208086019550808260051b84010181860160005b848110156112a457601f19868403018952611292838351611213565b98840198925090830190600101611276565b5090979650505050505050565b60006020808301818452808551808352604092508286019150828160051b87010184880160005b8381101561136a57888303603f19018552815180516001600160a01b031684528781015188850152868101518785015260608082015160e0919061131b816111f2565b9086015260808281015161132e816111f2565b9086015260a08281015115159086015260c09182015191850181905261135681860183611259565b9689019694505050908601906001016112d8565b509098975050505050505050565b634e487b7160e01b600052604160045260246000fd5b6000602082840312156113a057600080fd5b813567ffffffffffffffff808211156113b857600080fd5b818401915084601f8301126113cc57600080fd5b8135818111156113de576113de611378565b604051601f8201601f19908116603f0116810190838211818310171561140657611406611378565b8160405282815287602084870101111561141f57600080fd5b826020860160208301376000928101602001929092525095945050505050565b60c08152600061145260c0830189611213565b6001600160a01b0388811660208501528716604084015260ff86166060840152905061147d846111f2565b83608083015282151560a0830152979650505050505050565b606081016114a3856111f2565b9381526001600160a01b0392909216602083015260409091015290565b60208082526023908201527f536f6c6f2070756564656e20616363656465722061646d696e6973747261646f60408201526272657360e81b606082015260800190565b60208082526018908201527f4c612062696c6c657465726120657320696e76616c6964610000000000000000604082015260600190565b6020808252602e908201527f4c6120646972656363696f6e206465206c612062696c6c6574657261206e6f2060408201526d707565646520736572206365726f60901b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b818103818111156115b1576115b1611588565b92915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b60208082526021908201527f536f6c6f20656c2070726f706965746172696f207075656465206163636564656040820152603960f91b606082015260800190565b600181811c9082168061163857607f821691505b60208210810361165857634e487b7160e01b600052602260045260246000fd5b50919050565b60006001820161167057611670611588565b506001019056fea26469706673582212201d31199be9fc1beaff88268653011359e5f1449ad67e7e53a8170962dbe12c4664736f6c63430008110033";

type GestorBilleterasConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GestorBilleterasConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GestorBilleteras__factory extends ContractFactory {
  constructor(...args: GestorBilleterasConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GestorBilleteras> {
    return super.deploy(overrides || {}) as Promise<GestorBilleteras>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): GestorBilleteras {
    return super.attach(address) as GestorBilleteras;
  }
  override connect(signer: Signer): GestorBilleteras__factory {
    return super.connect(signer) as GestorBilleteras__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GestorBilleterasInterface {
    return new utils.Interface(_abi) as GestorBilleterasInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GestorBilleteras {
    return new Contract(address, _abi, signerOrProvider) as GestorBilleteras;
  }
}