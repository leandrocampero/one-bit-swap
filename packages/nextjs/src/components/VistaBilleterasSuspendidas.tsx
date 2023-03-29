import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Billetera, Estados } from '@/types.d'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import Nuevo from './NuevoSuspendido'

export default function VistaBilleterasSuspendidas() {
  const { getters, actions } = useBlockchainContext()
  const { bloqueados, transaccion } = getters
  const { cargarBloqueados, desbloquearBilletera } = actions

  const [getTextoBusqueda, setTextoBusqueda] = useState('')

  const handleClicRecargar = async () => {
    await cargarBloqueados()
  }

  const handleBuscar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextoBusqueda(event.target.value.trim())
  }

  const handleActivar = useCallback(
    async (direccion: string) => {
      await desbloquearBilletera(direccion)
    },
    [desbloquearBilletera]
  )

  const listarBilleterasSuspendidas = useCallback(() => {
    return bloqueados.datos
      .filter((billetera: Billetera) =>
        billetera.direccion.toLowerCase().includes(getTextoBusqueda)
      )
      .map((row: Billetera) => {
        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={Math.random() * 1000}
          >
            <TableCell key={row.direccion} align="left">
              {row.direccion}
            </TableCell>
            <TableCell key={row.direccion + row.rol} align="left">
              {row.estado == Estados.suspendido && (
                <Button
                  variant="contained"
                  onClick={() => handleActivar(row.direccion)}
                >
                  Activar
                </Button>
              )}
            </TableCell>
          </TableRow>
        )
      })
  }, [bloqueados, getTextoBusqueda, handleActivar])

  useEffect(() => {
    const { error, cargando } = transaccion
    if (!error && !cargando) {
      cargarBloqueados()
    }
  }, [transaccion, cargarBloqueados])

  return (
    <>
      <Nuevo />

      <TextField
        id="txt-busqueda"
        label={''}
        variant="outlined"
        onChange={handleBuscar}
      />

      <Button variant="contained" onClick={handleClicRecargar}>
        Recargar
      </Button>

      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  key="direccion"
                  align="left"
                  style={{ top: 0, minWidth: 50 }}
                >
                  Dirección
                </TableCell>
                <TableCell
                  key="acciones"
                  align="left"
                  style={{ top: 0, minWidth: 50 }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{listarBilleterasSuspendidas()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}
