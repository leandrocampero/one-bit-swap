import GestorBilleteras from '@lib/managers/GestorBilleteras'
import Billeteras from '@lib/models/Billeteras'
import { Estados, RolesBilleteras } from '@lib/types.d'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import Nuevo from './NuevoSuspendido'

export default function VistaBilleterasSuspendidas() {
  const [getTableData, setTableData] = useState<Billeteras[]>([])
  //const [getTableData, setTableData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [getTextoBusqueda, setTextoBusqueda] = useState('')

  const gestorBilletera = GestorBilleteras.instanciar()

  const handleClicRecargar = () => {
    // no se que hace aqui
  }

  const handleBuscar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextoBusqueda(event.target.value.trim())
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => {
    setTableData(
      gestorBilletera.buscar(getTextoBusqueda, RolesBilleteras.usuario)
    )
  }, [getTextoBusqueda])

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
            <TableBody>
              {getTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: Billeteras) => {
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
                            onClick={() => console.log('Activar Billetera')}
                          >
                            Activar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={getTableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}
