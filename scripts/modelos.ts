import Ordenes from '@lib/models/Ordenes'
import Tokens from '@lib/models/Tokens'
import { Estados, RolesBilleteras, TiposOrdenes } from '@lib/types.d'
import Billeteras from '@models/Billeteras'

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
const tUSDT = new Tokens('USDT', 'usdt_contrato', 'usdt_oraculo', 18)

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
  BigInt('1000000000000000000'),
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
  BigInt('1000000000000000000'),
  BigInt('1000000000000000000000'),
  new Date('2022-10-15'),
  0,
  0,
  TiposOrdenes.compraVenta
)

export const listaTodasOrdenes = [o1, o2, o3, o4, o5, o6, o7, o8, o9, o10, o11]
