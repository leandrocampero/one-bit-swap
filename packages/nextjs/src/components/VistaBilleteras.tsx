import { RolesBilleteras, Billetera } from '@/types.d'
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
import { useCallback, useContext, useEffect, useState } from 'react'
import Nuevo from './NuevoAdministrador'
import { BlockchainContext } from '@/context/BlockchainProvider'

export default function VistaBilleteras() {
  const { state, actions } = useContext(BlockchainContext)
  const { administradores } = state
  const { cargarAdministradores } = actions

  const [getTextoBusqueda, setTextoBusqueda] = useState('')

  const handleClicRecargar = () => {
    // no se que hace aqui
  }

  const handleBuscar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextoBusqueda(event.target.value.trim())
  }

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
              {row.rol == RolesBilleteras.administrador && (
                <Button
                  variant="contained"
                  onClick={() => console.log('Quitar Rol')}
                >
                  Quitar Rol Adminsitrador
                </Button>
              )}
            </TableCell>
          </TableRow>
        )
      })
  }, [administradores, getTextoBusqueda])

  useEffect(() => {
    cargarAdministradores()
  }, [cargarAdministradores])

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
