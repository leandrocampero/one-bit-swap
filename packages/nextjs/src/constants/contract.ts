const P01 = 'La plataforma se encuentra inactiva'
const P02 = 'Solo el propietario puede acceder'
const P03 = 'Solo pueden acceder administradores'
const P04 = 'La billetera esta suspendida'
const P05 = 'La plataforma ya se encuentra suspendida'
const P06 = 'La plataforma ya se encuentra activa'
const P07 = 'El monto nuevo no puede ser cero'

const B01 = 'La billetera es invalida'
const B02 = 'La direccion de la billetera no puede ser cero'
const B03 = 'No se puede cambiar el rol al propietario'
const B04 = 'La billetera ya tiene rol de administrador'
const B05 = 'La billetera no existe'
const B06 = 'La billetera no tiene rol administrador'
const B07 = 'No se puede suspender al propietario'
const B08 = 'La billetera ya se encuentra suspendida'
const B09 = 'La billetera ya se encuentra activa'

const O01 = 'No se aceptan campos vacios'
const O02 = 'Los montos ingresados son invalidos'
const O03 = 'Uno o ambos tokens se encuentran inactivos para operar'
const O04 = 'El monto a intercambiar es inferior al minimo aceptable en USD'
const O05 = 'Saldo de token insuficiente para cambiar'
const O06 = 'Saldo aprobado insuficiente para transferir'
const O07 = 'Fallo en la transferencia de tokens al contrato'
const O08 = 'La orden a ejecutar no existe o el Id es incorrecto'
const O09 = 'El creador de la orden no puede ejecutar la misma'
const O10 = 'La orden se encuentra suspendida y no se puede ejecutar'
const O11 = 'La orden ya no se encuentra activa'
const O12 = 'Fallo en la transferencia de tokens al vendedor'
const O13 = 'Fallo en la transferencia de tokens al comprador'
const O14 = 'Solo el creador de la orden puede cancelar misma'
const O15 = 'La orden ya se encuentra cancelada o finalizada'
const O16 = 'Fallo en la devolucion de tokens al vendedor'
const O17 = 'La orden solicitada no existe'

const T01 = 'La direccion del contrato es invalida'
const T02 = 'La direccion del oraculo es invalida'
const T03 = 'La direccion del oraculo no puede ser cero'
const T04 = 'El token ya esta registrado en la plataforma'
const T05 = 'El token ingresado no esta registrado'
const T06 = 'Los tokens no son validos o no estan registrados'
const T07 = 'No se pudo obtener datos de cotizacion'

const objectMessages: { [key: string]: string } = {
  P01,
  P02,
  P03,
  P04,
  P05,
  P06,
  P07,
  B01,
  B02,
  B03,
  B04,
  B05,
  B06,
  B07,
  B08,
  B09,
  O01,
  O02,
  O03,
  O04,
  O05,
  O06,
  O07,
  O08,
  O09,
  O10,
  O11,
  O12,
  O13,
  O14,
  O15,
  O16,
  O17,
  T01,
  T02,
  T03,
  T04,
  T05,
  T06,
  T07,
}

export default objectMessages
