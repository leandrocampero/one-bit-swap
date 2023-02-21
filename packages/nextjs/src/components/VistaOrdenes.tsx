import {
  Billetera,
  Orden,
  Token,
  Columna,
  Estados,
  EstadosOrdenes,
  NavMenu,
  TipoColumna,
  TiposOrdenes,
} from '@/types.d'
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import EjecutarOrden from './EjecutarOrden'
import { BlockchainContext } from '@/context/BlockchainContext'

export const OrdenContext = React.createContext<Orden | undefined>(undefined)

export default function VistaOrdenes() {
  const { state, actions } = useContext(BlockchainContext)
  const [getTokens, setTokens] = useState(Array<Token>)
  const [getOrdenes, setOrdenes] = useState(Array<Orden>)
  const [getTabValue, setTabValue] = useState(NavMenu.ordenesAbiertas)
  const [getBilleteraUsuario, setBilleteraUsuario] = useState<
    Billetera | undefined
  >(undefined)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [getTokenVenta, setTokenVenta] = useState<Token | null>(null)
  const [getTokenCompra, setTokenCompra] = useState<Token | null>(null)
  const [getTipoOrden, setTipoOrden] = useState(TiposOrdenes.todas)
  const [getMontoVenta, setMontoVenta] = useState(BigInt(0))
  const [getMontoCompra, setMontoCompra] = useState(BigInt(0))

  const { tokens, ordenes } = state
  const { cargarOrdenesActivas, cancelarOrden, ejecutarOrden } = actions

  const handleChangeTokenButton = () => {
    console.log('cambio ' + getTokenCompra + '  por ' + getTokenVenta)
    const aux = getTokenVenta
    setTokenVenta(getTokenCompra)
    setTokenCompra(aux)
    console.log('cambio ' + getTokenCompra + '  por ' + getTokenVenta)
  }

  const handleChangeTokenVenta = (
    event: React.SyntheticEvent,
    value: Token | null
  ) => {
    console.log(value?.ticker)
    setTokenVenta(value)
  }

  const handleChangeTokenCompra = (
    event: React.SyntheticEvent,
    value: Token | null
  ) => {
    console.log(value?.ticker)
    setTokenCompra(value)
  }

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setTipoOrden(parseInt(event.target.value))
    // setOrdenes(
    cargarOrdenesActivas(ordenes.datos[ordenes.datos.length - 1].idOrden)
    //)
  }

  const handleTabChange = (
    event: React.SyntheticEvent,
    nuevoValor: NavMenu
  ) => {
    setTabValue(nuevoValor)
    setPage(0)
  }

  function handleCancelarOrden(id: string) {
    cancelarOrden(id)
  }

  function handleEjecutarOrden(id: string) {
    ejecutarOrden(id)
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
    // setOrdenes(
    cargarOrdenesActivas(ordenes.datos[ordenes.datos.length - 1].idOrden)
    // )

    if (getTokens.length == 0) {
      setTokens(tokens.datos)
    }
  }, [
    getBilleteraUsuario,
    getTipoOrden,
    getTokenCompra,
    getTokenVenta,
    getMontoCompra,
    getMontoVenta,
    getTabValue,
  ])

  const columnas: Columna[] = [
    { id: TipoColumna.id, label: 'IdOrden', minWidth: 40, align: 'left' },
    { id: TipoColumna.tipo, label: 'Tipo', minWidth: 40, align: 'left' },
    {
      id: TipoColumna.cantidadVenta,
      label: 'CantidadVenta',
      minWidth: 60,
      align: 'left',
    },
    {
      id: TipoColumna.tokenVenta,
      label: 'TokenVenta',
      minWidth: 50,
      align: 'left',
    },
    {
      id: TipoColumna.cantidadCompra,
      label: 'CantidadCompra',
      minWidth: 60,
      align: 'left',
    },
    {
      id: TipoColumna.tokenCompra,
      label: 'TokenCompra',
      minWidth: 50,
      align: 'left',
    },
    { id: TipoColumna.boton, label: '', minWidth: 60, align: 'left' },
  ]

  return (
    <>
      <Tabs
        value={getTabValue}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value={NavMenu.ordenesAbiertas} label={NavMenu.ordenesAbiertas} />
        <Tab value={NavMenu.misOrdenes} label={NavMenu.misOrdenes} />
        <Tab value={NavMenu.miHistorial} label={NavMenu.miHistorial} />
      </Tabs>
      <Autocomplete
        id="token-select-venta"
        sx={{ width: 300 }}
        options={tokens.datos}
        getOptionDisabled={(option: Token) =>
          option.ticker === getTokenCompra?.ticker ||
          (option.estado == Estados.suspendido &&
            getTabValue != NavMenu.miHistorial)
        }
        value={getTokenVenta}
        onChange={handleChangeTokenVenta}
        autoHighlight
        getOptionLabel={(option: Token) => option.ticker}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img
              loading="lazy"
              width="20"
              src={`https://aux3.iconspalace.com/uploads/673308030241043147.png`}
              srcSet={`https://aux3.iconspalace.com/uploads/673308030241043147.png 2x`}
              alt=""
            />
            {option.ticker}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Token a Cambiar"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      <Button variant="contained" onClick={handleChangeTokenButton}>
        Cambiar
      </Button>
      {/*aqui deberia ir un boton de intercambio o una imagen de dos flechitas*/}
      <Autocomplete
        id="token-select-compra"
        sx={{ width: 300 }}
        options={tokens.datos}
        getOptionDisabled={(option) =>
          option.ticker === getTokenVenta?.ticker ||
          (option.estado == Estados.suspendido &&
            getTabValue != NavMenu.miHistorial)
        }
        value={getTokenCompra}
        onChange={handleChangeTokenCompra}
        autoHighlight
        getOptionLabel={(option: any) => option.ticker}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img
              loading="lazy"
              width="20"
              src={`https://aux3.iconspalace.com/uploads/673308030241043147.png`}
              srcSet={`https://aux3.iconspalace.com/uploads/673308030241043147.png 2x`}
              alt=""
            />
            {option.ticker}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Token a Recibir"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      <TextField
        id="txt-monto-venta"
        label="Monto de Venta"
        variant="outlined"
        value={getMontoVenta}
        onChange={(e) => setMontoVenta(BigInt(e.target.value))}
      />
      <TextField
        id="txt-monto-compra"
        label="Monto de Compra"
        variant="outlined"
        value={getMontoCompra}
        onChange={(e) => setMontoCompra(BigInt(e.target.value))}
      />
      <Select
        labelId="simple-select-label-tipo-orden"
        id="simple-select-tipo-orden"
        value={getTipoOrden.toString()}
        label="Tipo Orden"
        onChange={handleChangeSelect}
      >
        <MenuItem value={TiposOrdenes.todas}>Todas</MenuItem>
        <MenuItem value={TiposOrdenes.compraVenta}>Compra-Venta</MenuItem>
        <MenuItem value={TiposOrdenes.intercambio}>Intercambio</MenuItem>
      </Select>
      <Button variant="contained">Buscar</Button>
      {/* Tabla de ordenes */}
      {/* Tipo | Cantidad | Token | Cantidad | Token | Fecha */}
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columnas.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 0, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {getOrdenes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: Orden) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.idOrden + Date.now() * 2}
                    >
                      <TableCell key={row.idOrden + Date.now()} align="left">
                        {row.idOrden}
                      </TableCell>
                      <TableCell key={row.tipo + Date.now()} align="left">
                        {TiposOrdenes[row.tipo]}
                      </TableCell>
                      <TableCell
                        key={row.idOrden + row.tokenVenta + Date.now()}
                        align="left"
                      >
                        {row.montoVenta.toString()}
                      </TableCell>
                      <TableCell key={row.tokenVenta + Date.now()} align="left">
                        {row.tokenVenta}
                      </TableCell>
                      <TableCell
                        key={row.idOrden + row.tokenCompra + Date.now()}
                        align="left"
                      >
                        {row.montoCompra.toString()}
                      </TableCell>
                      <TableCell
                        key={row.tokenCompra + Date.now()}
                        align="left"
                      >
                        {row.tokenCompra}
                      </TableCell>
                      <TableCell
                        key={row.idOrden + 'acciones' + Date.now()}
                        align="left"
                      >
                        <ButtonGroup>
                          {row.vendedor == getBilleteraUsuario?.direccion &&
                            row.fechaFinalizacion == undefined &&
                            getTabValue != NavMenu.ordenesAbiertas && (
                              <Button
                                onClick={() => handleCancelarOrden(row.idOrden)}
                              >
                                Cancelar
                              </Button>
                            )}
                          {row.fechaFinalizacion == undefined &&
                            row.vendedor != getBilleteraUsuario?.direccion && (
                              // <Button
                              //   onClick={() =>
                              //     handleEjecutarOrden(
                              //       row.tipo,
                              //       row.idOrden,
                              //       getBilleteraUsuario
                              //     )
                              //   }
                              // >
                              //   Ejecutar
                              // </Button>
                              <OrdenContext.Provider value={row}>
                                <EjecutarOrden />
                              </OrdenContext.Provider>
                            )}
                        </ButtonGroup>
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
          count={getOrdenes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}
