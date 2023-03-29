import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Billetera, RolesBilleteras } from '@/types.d'
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
import React, { useCallback, useEffect, useState } from 'react'
import Nuevo from './NuevoAdministrador'

export default function VistaBilleteras() {
  const { getters, actions } = useBlockchainContext()
  const { administradores, transaccion, sesion } = getters
  const { cargarAdministradores, quitarAdministrador } = actions

  const [getTextoBusqueda, setTextoBusqueda] = useState('')

  const handleClicRecargar = async () => {
    await cargarAdministradores()
  }

  const handleBuscar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextoBusqueda(event.target.value.trim())
  }

  const handleQuitarRol = useCallback(
    async (billetera: string) => {
      await quitarAdministrador(billetera)
    },
    [quitarAdministrador]
  )

  const listarBilleterasAdministradoras = useCallback(() => {
    return administradores.datos
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
            <TableCell key={1} align="left">
              {sesion.datos.rol == RolesBilleteras.propietario && (
                <Button
                  variant="contained"
                  onClick={() => handleQuitarRol(row.direccion)}
                >
                  Quitar Rol Adminsitrador
                </Button>
              )}
            </TableCell>
          </TableRow>
        )
      })
  }, [administradores, getTextoBusqueda, handleQuitarRol])

  useEffect(() => {
    const { error, cargando } = transaccion
    if (!error && !cargando) {
      cargarAdministradores()
    }
  }, [transaccion, cargarAdministradores])

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
            <TableBody>{listarBilleterasAdministradoras()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}
