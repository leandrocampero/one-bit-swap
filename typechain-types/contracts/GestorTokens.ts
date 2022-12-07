/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export declare namespace Datos {
  export type OrdenStruct = {
    idOrden: PromiseOrValue<BytesLike>;
    siguienteOrdenActiva: PromiseOrValue<BytesLike>;
    anteriorOrdenActiva: PromiseOrValue<BytesLike>;
    siguienteOrdenGemela: PromiseOrValue<BytesLike>;
    anteriorOrdenGemela: PromiseOrValue<BytesLike>;
    vendedor: PromiseOrValue<string>;
    comprador: PromiseOrValue<string>;
    montoVenta: PromiseOrValue<BigNumberish>;
    montoCompra: PromiseOrValue<BigNumberish>;
    fechaCreacion: PromiseOrValue<BigNumberish>;
    fechaFinalizacion: PromiseOrValue<BigNumberish>;
    estado: PromiseOrValue<BigNumberish>;
    tipo: PromiseOrValue<BigNumberish>;
    existe: PromiseOrValue<boolean>;
    tokenCompra: PromiseOrValue<string>;
    tokenVenta: PromiseOrValue<string>;
  };

  export type OrdenStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    number,
    number,
    boolean,
    string,
    string
  ] & {
    idOrden: string;
    siguienteOrdenActiva: string;
    anteriorOrdenActiva: string;
    siguienteOrdenGemela: string;
    anteriorOrdenGemela: string;
    vendedor: string;
    comprador: string;
    montoVenta: BigNumber;
    montoCompra: BigNumber;
    fechaCreacion: BigNumber;
    fechaFinalizacion: BigNumber;
    estado: number;
    tipo: number;
    existe: boolean;
    tokenCompra: string;
    tokenVenta: string;
  };

  export type BilleteraStruct = {
    direccion: PromiseOrValue<string>;
    indiceAdmin: PromiseOrValue<BigNumberish>;
    indiceBloqueado: PromiseOrValue<BigNumberish>;
    rol: PromiseOrValue<BigNumberish>;
    estado: PromiseOrValue<BigNumberish>;
    existe: PromiseOrValue<boolean>;
    ordenes: PromiseOrValue<string>[];
  };

  export type BilleteraStructOutput = [
    string,
    BigNumber,
    BigNumber,
    number,
    number,
    boolean,
    string[]
  ] & {
    direccion: string;
    indiceAdmin: BigNumber;
    indiceBloqueado: BigNumber;
    rol: number;
    estado: number;
    existe: boolean;
    ordenes: string[];
  };

  export type TokenStruct = {
    ticker: PromiseOrValue<string>;
    contrato: PromiseOrValue<string>;
    oraculo: PromiseOrValue<string>;
    decimales: PromiseOrValue<BigNumberish>;
    estado: PromiseOrValue<BigNumberish>;
    existe: PromiseOrValue<boolean>;
  };

  export type TokenStructOutput = [
    string,
    string,
    string,
    number,
    number,
    boolean
  ] & {
    ticker: string;
    contrato: string;
    oraculo: string;
    decimales: number;
    estado: number;
    existe: boolean;
  };
}

export interface GestorTokensInterface extends utils.Interface {
  functions: {
    "activarToken(string)": FunctionFragment;
    "consultarCotizacion(string)": FunctionFragment;
    "emptyString(string)": FunctionFragment;
    "listarTokens(bool)": FunctionFragment;
    "modifcarOraculo(string,address)": FunctionFragment;
    "nuevoToken(address,address)": FunctionFragment;
    "ordenes()": FunctionFragment;
    "plataforma()": FunctionFragment;
    "suspenderToken(string)": FunctionFragment;
    "tokensRegistrados(string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "activarToken"
      | "consultarCotizacion"
      | "emptyString"
      | "listarTokens"
      | "modifcarOraculo"
      | "nuevoToken"
      | "ordenes"
      | "plataforma"
      | "suspenderToken"
      | "tokensRegistrados"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "activarToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "consultarCotizacion",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "emptyString",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "listarTokens",
    values: [PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "modifcarOraculo",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "nuevoToken",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "ordenes", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "plataforma",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "suspenderToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensRegistrados",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "activarToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "consultarCotizacion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "emptyString",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "listarTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "modifcarOraculo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nuevoToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ordenes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "plataforma", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "suspenderToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokensRegistrados",
    data: BytesLike
  ): Result;

  events: {
    "NuevaOrden(tuple)": EventFragment;
    "NuevoAdministrador(tuple)": EventFragment;
    "NuevoToken(tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NuevaOrden"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NuevoAdministrador"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NuevoToken"): EventFragment;
}

export interface NuevaOrdenEventObject {
  respuesta: Datos.OrdenStructOutput;
}
export type NuevaOrdenEvent = TypedEvent<
  [Datos.OrdenStructOutput],
  NuevaOrdenEventObject
>;

export type NuevaOrdenEventFilter = TypedEventFilter<NuevaOrdenEvent>;

export interface NuevoAdministradorEventObject {
  respuesta: Datos.BilleteraStructOutput;
}
export type NuevoAdministradorEvent = TypedEvent<
  [Datos.BilleteraStructOutput],
  NuevoAdministradorEventObject
>;

export type NuevoAdministradorEventFilter =
  TypedEventFilter<NuevoAdministradorEvent>;

export interface NuevoTokenEventObject {
  respuesta: Datos.TokenStructOutput;
}
export type NuevoTokenEvent = TypedEvent<
  [Datos.TokenStructOutput],
  NuevoTokenEventObject
>;

export type NuevoTokenEventFilter = TypedEventFilter<NuevoTokenEvent>;

export interface GestorTokens extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GestorTokensInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    activarToken(
      _ticker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    consultarCotizacion(
      _ticker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, number] & { precio: BigNumber; decimales: number }>;

    emptyString(
      _string: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    listarTokens(
      _incluirSuspendidos: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[Datos.TokenStructOutput[]]>;

    modifcarOraculo(
      _ticker: PromiseOrValue<string>,
      _oraculo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    nuevoToken(
      _contrato: PromiseOrValue<string>,
      _oraculo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    ordenes(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        cantidadTotal: BigNumber;
        cantidadActivas: BigNumber;
        ultimaOrdenActiva: string;
      }
    >;

    plataforma(
      overrides?: CallOverrides
    ): Promise<
      [number, string, BigNumber] & {
        estado: number;
        propietario: string;
        montoMinimoUSD: BigNumber;
      }
    >;

    suspenderToken(
      _ticker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tokensRegistrados(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, number, number, boolean] & {
        ticker: string;
        contrato: string;
        oraculo: string;
        decimales: number;
        estado: number;
        existe: boolean;
      }
    >;
  };

  activarToken(
    _ticker: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  consultarCotizacion(
    _ticker: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, number] & { precio: BigNumber; decimales: number }>;

  emptyString(
    _string: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  listarTokens(
    _incluirSuspendidos: PromiseOrValue<boolean>,
    overrides?: CallOverrides
  ): Promise<Datos.TokenStructOutput[]>;

  modifcarOraculo(
    _ticker: PromiseOrValue<string>,
    _oraculo: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  nuevoToken(
    _contrato: PromiseOrValue<string>,
    _oraculo: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  ordenes(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, string] & {
      cantidadTotal: BigNumber;
      cantidadActivas: BigNumber;
      ultimaOrdenActiva: string;
    }
  >;

  plataforma(
    overrides?: CallOverrides
  ): Promise<
    [number, string, BigNumber] & {
      estado: number;
      propietario: string;
      montoMinimoUSD: BigNumber;
    }
  >;

  suspenderToken(
    _ticker: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tokensRegistrados(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, number, number, boolean] & {
      ticker: string;
      contrato: string;
      oraculo: string;
      decimales: number;
      estado: number;
      existe: boolean;
    }
  >;

  callStatic: {
    activarToken(
      _ticker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    consultarCotizacion(
      _ticker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, number] & { precio: BigNumber; decimales: number }>;

    emptyString(
      _string: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    listarTokens(
      _incluirSuspendidos: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<Datos.TokenStructOutput[]>;

    modifcarOraculo(
      _ticker: PromiseOrValue<string>,
      _oraculo: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    nuevoToken(
      _contrato: PromiseOrValue<string>,
      _oraculo: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    ordenes(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        cantidadTotal: BigNumber;
        cantidadActivas: BigNumber;
        ultimaOrdenActiva: string;
      }
    >;

    plataforma(
      overrides?: CallOverrides
    ): Promise<
      [number, string, BigNumber] & {
        estado: number;
        propietario: string;
        montoMinimoUSD: BigNumber;
      }
    >;

    suspenderToken(
      _ticker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    tokensRegistrados(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, number, number, boolean] & {
        ticker: string;
        contrato: string;
        oraculo: string;
        decimales: number;
        estado: number;
        existe: boolean;
      }
    >;
  };

  filters: {
    "NuevaOrden(tuple)"(respuesta?: null): NuevaOrdenEventFilter;
    NuevaOrden(respuesta?: null): NuevaOrdenEventFilter;

    "NuevoAdministrador(tuple)"(
      respuesta?: null
    ): NuevoAdministradorEventFilter;
    NuevoAdministrador(respuesta?: null): NuevoAdministradorEventFilter;

    "NuevoToken(tuple)"(respuesta?: null): NuevoTokenEventFilter;
    NuevoToken(respuesta?: null): NuevoTokenEventFilter;
  };

  estimateGas: {
    activarToken(
      _ticker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    consultarCotizacion(
      _ticker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    emptyString(
      _string: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    listarTokens(
      _incluirSuspendidos: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    modifcarOraculo(
      _ticker: PromiseOrValue<string>,
      _oraculo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    nuevoToken(
      _contrato: PromiseOrValue<string>,
      _oraculo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    ordenes(overrides?: CallOverrides): Promise<BigNumber>;

    plataforma(overrides?: CallOverrides): Promise<BigNumber>;

    suspenderToken(
      _ticker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tokensRegistrados(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    activarToken(
      _ticker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    consultarCotizacion(
      _ticker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    emptyString(
      _string: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    listarTokens(
      _incluirSuspendidos: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    modifcarOraculo(
      _ticker: PromiseOrValue<string>,
      _oraculo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    nuevoToken(
      _contrato: PromiseOrValue<string>,
      _oraculo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    ordenes(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    plataforma(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    suspenderToken(
      _ticker: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tokensRegistrados(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
