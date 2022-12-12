import BlockchainAdapter from '@lib/BlockchainAdapter'
import GestorBilleteras from '@lib/managers/GestorBilleteras'
import GestorTokens from '@lib/managers/GestorTokens'
import { Acciones, Estados, NavMenu } from '@lib/types.d'
import {
  Button,
  Checkbox,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { b10 } from '../scripts/modelos'

export default function VistaAdminsitrador() {
  const [getTabValue, setTabValue] = useState(NavMenu.billeteras)
  const [getBilleteraUsuario, setBilleteraUsuario] = useState(b10)
  //const [getTableData, setTableData] = useState(Billeteras[] | Tokens[])
  const [getTableData, setTableData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [getColumnas, setColumnas] = useState([])
  const [getIncluyeBajas, setIncluyeBajas] = useState(Estados.suspendido)
  const adapter = new BlockchainAdapter()
  const gestorBilletera = new GestorBilleteras()
  const gestorTokens = new GestorTokens()

  const handleTabChange = (
    event: React.SyntheticEvent,
    nuevoValor: NavMenu
  ) => {
    setTabValue(nuevoValor)
    if (getTabValue == NavMenu.billeteras) {
      //setear data de billeteras
      //setTableData()
    } else if (getTabValue == NavMenu.tokens) {
      // setear data de tokens
      //setTableData()
    }
  }

  function handleClickAccion(accion: string) {
    switch (accion) {
      case Acciones.activar:
        //llamar a funcion de activar
        break
      case Acciones.desactivar:
        // llamar a funcion de desactivar
        break
      case Acciones.admin:
        // llamar a funcion de hacer Admin
        break
      case Acciones.superadmin:
        // llamar a funcion de hacer superadmin
        break
      case Acciones.modificar:
        // llamar a funcion de modificar
        break
      case Acciones.detalles:
        // llamar a detalles
        break
      default:
        // manejar esta opcion?
        break
    }
  }

  const handleClicNuevo = () => {
    if (getTabValue == NavMenu.billeteras) {
      // llamar a menu de nueva billetera
    } else if (getTabValue == NavMenu.tokens) {
      // llamar a menu de nuevo token
    }
  }

  const handleClicRecargar = () => {
    // no se que hace aqui
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

  const cargarCelda = (columna: any, value: any) => {
    switch (columna.id) {
      case 'simbolo':
        return <h1>Imagen</h1>
      case 'estado':
        return <h1>{value == Estados.activo ? 'A' : 'I'}</h1>
      case 'acciones':
        return (
          <Button variant="contained" onClick={() => handleClickAccion(value)}>
            {value}
          </Button>
        )
      default:
        return value
    }
  }

  return (
    <div>
      <Tabs
        value={getTabValue}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        {gestorBilletera.verificarRol(getBilleteraUsuario) > 1 && (
          <Tab value={NavMenu.billeteras} label={NavMenu.billeteras} />
        )}
        {gestorBilletera.verificarRol(getBilleteraUsuario) > 1 && (
          <Tab value={NavMenu.tokens} label={NavMenu.tokens} />
        )}
      </Tabs>

      <Button variant="contained" onClick={handleClicNuevo}>
        Nuevo
      </Button>

      <TextField id="txt-busqueda" label={getTabValue} variant="outlined" />

      <Checkbox
        value={getIncluyeBajas}
        onChange={(e) =>
          setIncluyeBajas(
            e.target.valueAsNumber == Estados.activo
              ? Estados.activo
              : Estados.suspendido
          )
        }
      />

      <Button variant="contained" onClick={handleClicRecargar}>
        Recargar
      </Button>

      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableBody>
              {getTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.Id}>
                      {getColumnas.map((column) => {
                        const value = row[column.id]
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {cargarCelda(column, value)}
                          </TableCell>
                        )
                      })}
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
    </div>
  )
}
