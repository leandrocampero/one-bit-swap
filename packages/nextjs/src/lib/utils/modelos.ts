import Billeteras from '@/lib/models/Billeteras'
import Ordenes from '@/lib/models/Ordenes'
import Tokens from '@/lib/models/Tokens'
import { Estados, RolesBilleteras, TiposOrdenes } from '@/lib/types.d'

// tokens
// tokens desactivados
const tMATIC = new Tokens('MATIC', 'bnb_contrato', 'bnb_oraculo', 18)
tMATIC.estado = Estados.suspendido
const tLUNA = new Tokens('LUNA', 'bnb_contrato', 'bnb_oraculo', 18)
tLUNA.estado = Estados.suspendido
const tAAA = new Tokens('AAA', 'bnb_contrato', 'bnb_oraculo', 18)
tAAA.estado = Estados.suspendido
const tDODGE = new Tokens('DODGE', 'bnb_contrato', 'bnb_oraculo', 18)
tDODGE.estado = Estados.suspendido
// tokens activados
const tBNB = new Tokens('BNB', 'bnb_contrato', 'bnb_oraculo', 18)
const tONE = new Tokens('ONE', 'one_contrato', 'one_oraculo', 18)
const tETH = new Tokens('ETH', 'eth_contrato', 'eth_oraculo', 18)
const tBTC = new Tokens('BTC', 'btc_contrato', 'btc_oraculo', 18)
const tDAI = new Tokens('DAI', 'dai_contrato', 'dai_oraculo', 18)
export const tUSDT = new Tokens('USDT', 'usdt_contrato', 'usdt_oraculo', 18)

// billeteras
export const b1 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7441')
export const b2 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7442')
export const b3 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7443')
export const b4 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7444')
export const b5 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7445')
export const b6 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7446')
export const b7 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7447')
export const b8 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7448')
export const b9 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7449')
export const b10 = new Billeteras('0xD16DA42A2f5C89223E8f2e35e7F1B0a499cf7440')
b10.rol = RolesBilleteras.administrador

export const listaTokens = [
  tMATIC,
  tLUNA,
  tAAA,
  tDODGE,
  tBNB,
  tONE,
  tETH,
  tBTC,
  tDAI,
  tUSDT,
]

const o1 = new Ordenes(
  '1',
  b1,
  b2,
  tBNB,
  tUSDT,
  BigInt('1000000000000000000'),
  BigInt('0'),
  new Date('2022-10-07'),
  20.6,
  30.7,
  TiposOrdenes.intercambio
)
const o2 = new Ordenes(
  '2',
  b3,
  b4,
  tBTC,
  tETH,
  BigInt('800000000000000000'),
  BigInt('12000000000000000000'),
  new Date('2022-10-08'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o3 = new Ordenes(
  '3',
  b5,
  b6,
  tONE,
  tDAI,
  BigInt('10000000000000000000000'),
  BigInt('200000000000000000'),
  new Date('2022-10-09'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o4 = new Ordenes(
  '4',
  b7,
  b8,
  tDAI,
  tBTC,
  BigInt('77000000000000000000'),
  BigInt('0'),
  new Date('2022-10-11'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o5 = new Ordenes(
  '5',
  b9,
  b10,
  tETH,
  tBNB,
  BigInt('25000000000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o6 = new Ordenes(
  '6',
  b2,
  b10,
  tETH,
  tBTC,
  BigInt('4000000000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o7 = new Ordenes(
  '7',
  b3,
  b9,
  tONE,
  tDAI,
  BigInt('17000000000000000000'),
  BigInt('500000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o8 = new Ordenes(
  '8',
  b4,
  b8,
  tDAI,
  tBNB,
  BigInt('2000000000000000000'),
  BigInt('30000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o9 = new Ordenes(
  '9',
  b5,
  b7,
  tBTC,
  tONE,
  BigInt('100000000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o10 = new Ordenes(
  '10',
  b9,
  b5,
  tBTC,
  tUSDT,
  BigInt('500000000000000000'),
  BigInt('100000000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o11 = new Ordenes(
  '11',
  b10,
  b5,
  tETH,
  tONE,
  BigInt('100000000000000000'),
  BigInt('2000000000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o12 = new Ordenes(
  '12',
  b10,
  b1,
  tDAI,
  tONE,
  BigInt('3000000000000000000'),
  BigInt('3000000000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)

const o13 = new Ordenes(
  '1',
  b1,
  b2,
  tBNB,
  tUSDT,
  BigInt('1500000000000000000'),
  BigInt('05'),
  new Date('2022-10-07'),
  20.6,
  30.7,
  TiposOrdenes.intercambio
)
const o14 = new Ordenes(
  '2',
  b3,
  b4,
  tBTC,
  tETH,
  BigInt('820000000000000000'),
  BigInt('12400000000000000000'),
  new Date('2022-10-08'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o15 = new Ordenes(
  '3',
  b5,
  b6,
  tONE,
  tDAI,
  BigInt('10050000000000000000000'),
  BigInt('200050000000000000'),
  new Date('2022-10-09'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o16 = new Ordenes(
  '4',
  b7,
  b8,
  tDAI,
  tBTC,
  BigInt('77000700000000000000'),
  BigInt('0'),
  new Date('2022-10-11'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o17 = new Ordenes(
  '5',
  b9,
  b10,
  tETH,
  tBNB,
  BigInt('25004000000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o18 = new Ordenes(
  '6',
  b2,
  b10,
  tETH,
  tBTC,
  BigInt('4000050000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o19 = new Ordenes(
  '7',
  b3,
  b9,
  tONE,
  tDAI,
  BigInt('17004000000000000000'),
  BigInt('500009000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o20 = new Ordenes(
  '8',
  b4,
  b8,
  tDAI,
  tBNB,
  BigInt('2000005000000000000'),
  BigInt('30000005000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o21 = new Ordenes(
  '9',
  b5,
  b7,
  tBTC,
  tONE,
  BigInt('1000000050000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o22 = new Ordenes(
  '10',
  b9,
  b5,
  tBTC,
  tUSDT,
  BigInt('505000000000000000'),
  BigInt('100500000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o23 = new Ordenes(
  '11',
  b10,
  b5,
  tETH,
  tONE,
  BigInt('1000005000000000000'),
  BigInt('1000050000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o24 = new Ordenes(
  '12',
  b10,
  b1,
  tDAI,
  tONE,
  BigInt('1000000500000000000'),
  BigInt('1000000050000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o25 = new Ordenes(
  '1',
  b1,
  b2,
  tBNB,
  tUSDT,
  BigInt('1000000007000000000'),
  BigInt('0'),
  new Date('2022-10-07'),
  20.6,
  30.7,
  TiposOrdenes.intercambio
)
const o26 = new Ordenes(
  '2',
  b3,
  b4,
  tBTC,
  tETH,
  BigInt('807000000000000000'),
  BigInt('12700000000000000000'),
  new Date('2022-10-08'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o27 = new Ordenes(
  '3',
  b5,
  b6,
  tONE,
  tDAI,
  BigInt('10070000000000000000000'),
  BigInt('200070000000000000'),
  new Date('2022-10-09'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o28 = new Ordenes(
  '4',
  b7,
  b8,
  tDAI,
  tBTC,
  BigInt('77000700000000000000'),
  BigInt('0'),
  new Date('2022-10-11'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o29 = new Ordenes(
  '5',
  b9,
  b10,
  tETH,
  tBNB,
  BigInt('25000070000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o30 = new Ordenes(
  '6',
  b2,
  b10,
  tETH,
  tBTC,
  BigInt('4070000000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o31 = new Ordenes(
  '7',
  b3,
  b9,
  tONE,
  tDAI,
  BigInt('17070000000000000000'),
  BigInt('500700000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o32 = new Ordenes(
  '8',
  b4,
  b8,
  tDAI,
  tBNB,
  BigInt('2000700000000000000'),
  BigInt('30007000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o33 = new Ordenes(
  '9',
  b5,
  b7,
  tBTC,
  tONE,
  BigInt('1000070000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o34 = new Ordenes(
  '10',
  b9,
  b5,
  tBTC,
  tUSDT,
  BigInt('500000700000000000'),
  BigInt('100000070000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o35 = new Ordenes(
  '11',
  b10,
  b5,
  tETH,
  tONE,
  BigInt('1000000007000000000'),
  BigInt('1000000070000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o36 = new Ordenes(
  '12',
  b10,
  b1,
  tDAI,
  tONE,
  BigInt('1700000000000000000'),
  BigInt('7000000000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o37 = new Ordenes(
  '1',
  b1,
  b2,
  tBNB,
  tUSDT,
  BigInt('1080000000000000000'),
  BigInt('0'),
  new Date('2022-10-07'),
  20.6,
  30.7,
  TiposOrdenes.intercambio
)
const o38 = new Ordenes(
  '2',
  b3,
  b4,
  tBTC,
  tETH,
  BigInt('800800000000000000'),
  BigInt('12008000000000000000'),
  new Date('2022-10-08'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o39 = new Ordenes(
  '3',
  b5,
  b6,
  tONE,
  tDAI,
  BigInt('10000080000000000000000'),
  BigInt('200008000000000000'),
  new Date('2022-10-09'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o40 = new Ordenes(
  '4',
  b7,
  b8,
  tDAI,
  tBTC,
  BigInt('77000008000000000000'),
  BigInt('0'),
  new Date('2022-10-11'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o41 = new Ordenes(
  '5',
  b9,
  b10,
  tETH,
  tBNB,
  BigInt('25000000800000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o42 = new Ordenes(
  '6',
  b2,
  b10,
  tETH,
  tBTC,
  BigInt('4000000008000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o43 = new Ordenes(
  '7',
  b3,
  b9,
  tONE,
  tDAI,
  BigInt('17000000008000000000'),
  BigInt('500000080000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o44 = new Ordenes(
  '8',
  b4,
  b8,
  tDAI,
  tBNB,
  BigInt('2000000800000000000'),
  BigInt('30000000800000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o45 = new Ordenes(
  '9',
  b5,
  b7,
  tBTC,
  tONE,
  BigInt('1000000008000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o46 = new Ordenes(
  '10',
  b9,
  b5,
  tBTC,
  tUSDT,
  BigInt('500000000080000000'),
  BigInt('100000000008000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o47 = new Ordenes(
  '11',
  b10,
  b5,
  tETH,
  tONE,
  BigInt('1000000000008000000'),
  BigInt('1000000000000800000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o48 = new Ordenes(
  '12',
  b10,
  b1,
  tDAI,
  tONE,
  BigInt('1000000000000080000'),
  BigInt('1000000000000008000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o49 = new Ordenes(
  '1',
  b1,
  b2,
  tBNB,
  tUSDT,
  BigInt('1000000000000000800'),
  BigInt('0'),
  new Date('2022-10-07'),
  20.6,
  30.7,
  TiposOrdenes.intercambio
)
const o50 = new Ordenes(
  '2',
  b3,
  b4,
  tBTC,
  tETH,
  BigInt('8000000000000000900'),
  BigInt('12000000000000000900'),
  new Date('2022-10-08'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o51 = new Ordenes(
  '3',
  b5,
  b6,
  tONE,
  tDAI,
  BigInt('90000000000000000000000'),
  BigInt('290000000000000000'),
  new Date('2022-10-09'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o52 = new Ordenes(
  '4',
  b7,
  b8,
  tDAI,
  tBTC,
  BigInt('77900000000000000000'),
  BigInt('0'),
  new Date('2022-10-11'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o53 = new Ordenes(
  '5',
  b9,
  b10,
  tETH,
  tBNB,
  BigInt('25090000000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o54 = new Ordenes(
  '6',
  b2,
  b10,
  tETH,
  tBTC,
  BigInt('4000900000000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o55 = new Ordenes(
  '7',
  b3,
  b9,
  tONE,
  tDAI,
  BigInt('17000900000000000000'),
  BigInt('500000900000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o56 = new Ordenes(
  '8',
  b4,
  b8,
  tDAI,
  tBNB,
  BigInt('2000000900000000000'),
  BigInt('30000000900000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o57 = new Ordenes(
  '9',
  b5,
  b7,
  tBTC,
  tONE,
  BigInt('1000000009000000000'),
  BigInt('0'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o58 = new Ordenes(
  '10',
  b9,
  b5,
  tBTC,
  tUSDT,
  BigInt('500000000090000000'),
  BigInt('100000000009000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o59 = new Ordenes(
  '11',
  b10,
  b5,
  tETH,
  tONE,
  BigInt('1090000000000000000'),
  BigInt('1009000000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o60 = new Ordenes(
  '12',
  b10,
  b1,
  tDAI,
  tONE,
  BigInt('1000900000000000000'),
  BigInt('1000090000000000000000'),
  new Date('2023-01-01'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o61 = new Ordenes(
  '1',
  b1,
  b2,
  tBNB,
  tUSDT,
  BigInt('1000009000000000000'),
  BigInt('0'),
  new Date('2022-10-07'),
  20.6,
  30.7,
  TiposOrdenes.intercambio
)
const o62 = new Ordenes(
  '2',
  b3,
  b4,
  tBTC,
  tETH,
  BigInt('800000090000000000'),
  BigInt('1200000090000000000'),
  new Date('2022-10-08'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o63 = new Ordenes(
  '3',
  b5,
  b6,
  tONE,
  tDAI,
  BigInt('1000000000040000000000'),
  BigInt('2000000009900000'),
  new Date('2022-10-09'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o64 = new Ordenes(
  '4',
  b7,
  b8,
  tDAI,
  tBTC,
  BigInt('7700490000000000000'),
  BigInt('0'),
  new Date('2022-10-11'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o65 = new Ordenes(
  '5',
  b9,
  b10,
  tETH,
  tBNB,
  BigInt('2500004900000000000'),
  BigInt('0'),
  new Date('2022-10-02'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o66 = new Ordenes(
  '6',
  b2,
  b10,
  tETH,
  tBTC,
  BigInt('400490000000000000000'),
  BigInt('0'),
  new Date('2022-10-19'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o67 = new Ordenes(
  '7',
  b3,
  b9,
  tONE,
  tDAI,
  BigInt('170009400000000000000'),
  BigInt('50000004000000000'),
  new Date('2022-10-18'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o68 = new Ordenes(
  '8',
  b4,
  b8,
  tDAI,
  tBNB,
  BigInt('20000000940000000000'),
  BigInt('300000000049000000'),
  new Date('2023-01-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o69 = new Ordenes(
  '9',
  b5,
  b7,
  tBTC,
  tONE,
  BigInt('10000000000049900000'),
  BigInt('0'),
  new Date('2022-10-17'),
  0,
  0,
  TiposOrdenes.intercambio
)
const o70 = new Ordenes(
  '10',
  b9,
  b5,
  tBTC,
  tUSDT,
  BigInt('50000000040000000'),
  BigInt('10000000004000000000'),
  new Date('2022-12-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o71 = new Ordenes(
  '11',
  b10,
  b5,
  tETH,
  tONE,
  BigInt('1000000000044000000'),
  BigInt('1000000000000440000'),
  new Date('2022-11-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
const o72 = new Ordenes(
  '12',
  b10,
  b1,
  tDAI,
  tONE,
  BigInt('100000000000000444'),
  BigInt('19944444000000'),
  new Date('2022-11-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)
export const listaTodasOrdenes = [
  o1,
  o2,
  o3,
  o4,
  o5,
  o6,
  o7,
  o8,
  o9,
  o10,
  o11,
  o12,
  o13,
  o14,
  o15,
  o16,
  o17,
  o18,
  o19,
  o20,
  o21,
  o22,
  o23,
  o24,
  o25,
  o26,
  o27,
  o28,
  o29,
  o30,
  o31,
  o32,
  o33,
  o34,
  o35,
  o36,
  o37,
  o38,
  o39,
  o40,
  o41,
  o42,
  o43,
  o44,
  o45,
  o46,
  o47,
  o48,
  o49,
  o50,
  o51,
  o52,
  o53,
  o54,
  o55,
  o56,
  o57,
  o58,
  o59,
  o60,
  o61,
  o62,
  o63,
  o64,
  o65,
  o66,
  o67,
  o68,
  o69,
  o70,
  o71,
  o72,
]
