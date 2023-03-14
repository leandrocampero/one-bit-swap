import {
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
  TableRow,
  Tabs,
  TextField,
} from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import EjecutarOrden from './EjecutarOrden'
import { BlockchainContext } from '@/context/BlockchainProvider'
import { ethers } from 'ethers'

export const OrdenContext = React.createContext<Orden | undefined>(undefined)

export default function VistaOrdenes() {
  const { state, actions } = useContext(BlockchainContext)
  const { tokens, ordenes, sesion } = state
  const { cargarOrdenesActivas, cargarOrdenesPropias, cancelarOrden } = actions

  const [getTabValue, setTabValue] = useState(NavMenu.ordenesAbiertas)
  const [getBilleteraUsuario, setBilleteraUsuario] = useState<string>(
    sesion.datos.direccion
  )
  const [getTokenVenta, setTokenVenta] = useState<Token | null>(null)
  const [getTokenCompra, setTokenCompra] = useState<Token | null>(null)
  const [getTipoOrden, setTipoOrden] = useState(TiposOrdenes.todas)
  const [getMontoVenta, setMontoVenta] = useState(BigInt(0))
  const [getMontoCompra, setMontoCompra] = useState(BigInt(0))

  const handleCambiarTokenButton = () => {
    const aux = getTokenVenta
    setTokenVenta(getTokenCompra)
    setTokenCompra(aux)
  }

  const handleCambiarTokenVenta = (
    event: React.SyntheticEvent,
    value: Token | null
  ) => {
    console.log(value?.ticker)
    setTokenVenta(value)
  }

  const handleCambiarTokenCompra = (
    event: React.SyntheticEvent,
    value: Token | null
  ) => {
    console.log(value?.ticker)
    setTokenCompra(value)
  }

  const handleCambiarTipoOrden = (event: SelectChangeEvent) => {
    setTipoOrden(parseInt(event.target.value))
  }

  const handleCambiarNavMenu = (
    event: React.SyntheticEvent,
    nuevoValor: NavMenu
  ) => {
    setTabValue(nuevoValor)

    console.log(ordenes.datos.length + ' antes')
    console.log(ordenes.datos[0]?.idOrden + 'id antes')

    if (nuevoValor == NavMenu.ordenesAbiertas) {
      cargarOrdenesActivas(ethers.constants.AddressZero)

      console.log('activas')
    } else {
      cargarOrdenesPropias()

      console.log('propias')
    }

    console.log(ordenes.datos.length + ' despues')
    console.log(ordenes.datos[0]?.idOrden + 'id despues')
  }

  function handleCancelarOrden(id: string) {
    cancelarOrden(id)
  }

  const handleCargarMas = useCallback(() => {
    const cantidadOrdenes = ordenes.datos.length
    const ultimaOrden =
      (cantidadOrdenes !== 0 && ordenes.datos[cantidadOrdenes - 1].idOrden) ||
      ethers.constants.HashZero

    cargarOrdenesActivas(ultimaOrden)
  }, [ordenes, cargarOrdenesActivas])

  useEffect(() => {
    cargarOrdenesActivas(ethers.constants.AddressZero)
  }, [cargarOrdenesActivas])

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
        onChange={handleCambiarNavMenu}
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
        onChange={handleCambiarTokenVenta}
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
      <Button variant="contained" onClick={handleCambiarTokenButton}>
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
        onChange={handleCambiarTokenCompra}
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
        onChange={handleCambiarTipoOrden}
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
                <TableCell>Vendedor</TableCell>
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
              {ordenes.datos
                .filter((row: Orden) => {
                  // si es propia y estoy viendo mis ordenes solo me interesa que se vean las activas
                  // en cualquier otro caso me interesan ver todas
                  return (
                    // filtro por token de compra
                    (getTokenCompra?.ticker == row.tokenCompra ||
                      getTokenCompra == null) &&
                    // filtro por token de venta
                    (getTokenVenta?.ticker == row.tokenVenta ||
                      getTokenVenta == null) &&
                    // filtro por tipo de orden
                    (getTipoOrden == row.tipo ||
                      getTipoOrden == TiposOrdenes.todas) &&
                    // filtro por tipo de  tab (abiertas, mis Ordenes, historial)
                    (getTabValue == NavMenu.misOrdenes
                      ? row.estado == EstadosOrdenes.activa
                      : true)
                  )
                })
                .map((row: Orden) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.idOrden + Date.now() * 2}
                    >
                      <TableCell key={row.vendedor + Date.now()} align="left">
                        {row.vendedor}
                      </TableCell>
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
                          {row.vendedor == getBilleteraUsuario &&
                            row.fechaFinalizacion == undefined &&
                            getTabValue != NavMenu.ordenesAbiertas && (
                              <Button
                                onClick={() => handleCancelarOrden(row.idOrden)}
                              >
                                Cancelar
                              </Button>
                            )}
                          {row.fechaFinalizacion == undefined &&
                            row.vendedor != getBilleteraUsuario && (
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
        <Button disabled={ordenes.cargando} onClick={handleCargarMas}>
          {ordenes.cargando ? 'Loading...' : 'Press to load more'}
        </Button>
      </Paper>
    </>
  )
}
