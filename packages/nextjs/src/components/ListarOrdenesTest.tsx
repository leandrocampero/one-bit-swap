import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Token } from '@/types.d'
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { blue } from '@mui/material/colors'
import { BigNumber, ethers } from 'ethers'
import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import TarjetaOrden from './Ordenes/TarjetaOrden'
import { ContainerBox } from './common/styles'

/******************************************************************************/

const ID_TAB_PANEL = 'ordenes-tabpanel'
const ARIA_LABEL_PANEL = 'ordenes-tab'
const NAV_ITEMS = ['Ordenes activas', 'Mis ordenes', 'Historial']
const TIPO_ORDEN = ['Compra-Venta', 'Intercambio', 'Todas']

const a11yProps = (index: number) => {
  return {
    id: `${ID_TAB_PANEL}-${index}`,
    'aria-controls': `${ARIA_LABEL_PANEL}-${index}`,
  }
}

/******************************************************************************/

export default function ListarOrdenes() {
  const [tab, setTab] = useState(0)
  const { getters, actions } = useBlockchainContext()
  const [tokenVenta, setTokenVenta] = useState<string>('TODOS')
  const [tokenCompra, setTokenCompra] = useState<string>('TODOS')
  const [tipoOrden, setTipoOrden] = useState<string>('Todas')
  const [montoMaximo, setMontoMaximo] = useState<number | undefined>()

  const { ordenes, tokens } = getters
  const { cargarOrdenesActivas } = actions

  /******************************************************************************/

  const handleCargarMas = useCallback(() => {
    const cantidadOrdenes = ordenes.datos.length
    const ultimaOrden =
      (cantidadOrdenes !== 0 && ordenes.datos[cantidadOrdenes - 1].idOrden) ||
      ethers.constants.HashZero

    cargarOrdenesActivas(ultimaOrden)
  }, [ordenes, cargarOrdenesActivas])

  const handleSincronizar = useCallback(() => {
    cargarOrdenesActivas(ethers.constants.HashZero)
  }, [cargarOrdenesActivas])

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTab(newValue)
    },
    []
  )

  /******************************************************************************/

  const ordenesRender = useMemo(() => {
    return ordenes.datos
      .filter(
        (orden) =>
          (tokenVenta === 'TODOS' || orden.tokenVenta === tokenVenta) &&
          (tokenCompra === 'TODOS' || orden.tokenCompra === tokenCompra) &&
          (tipoOrden === 'Todas' || TIPO_ORDEN[orden.tipo] === tipoOrden) &&
          (!montoMaximo ||
            BigNumber.from(orden.montoVenta).lte(
              ethers.utils.parseUnits(montoMaximo.toString())
            ))
      )
      .map((orden, index) => (
        <TarjetaOrden
          key={orden.idOrden}
          orden={orden}
          sx={{ ...(index !== 0 && { marginTop: 3 }) }}
        />
      ))
  }, [ordenes, montoMaximo, tokenCompra, tokenVenta, tipoOrden])

  /******************************************************************************/

  return (
    <>
      <Box sx={{ ...ContainerBox, padding: 0 }}>
        <Box
          sx={{
            backgroundColor: 'primary.dark',
            color: 'common.white',
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            aria-label="ordenes-nav-tabs"
            variant="fullWidth"
            sx={{ '&.MuiTabs-indicator': 'primary.dark' }}
          >
            {NAV_ITEMS.map((item, index) => (
              <Tab
                key={index}
                sx={{
                  color: 'common.white',
                  '&.Mui-selected': {
                    backgroundColor: blue[200],
                    color: 'common.white',
                    fontWeight: 'bold',
                  },
                }}
                label={item}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            padding: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              {/* TOKEN VENTA */}
              <FormControl fullWidth>
                <InputLabel id="token-venta-input">Token Venta</InputLabel>
                <Select
                  labelId="token-venta-input"
                  id="token-compra"
                  value={tokenVenta}
                  label="token-venta"
                  onChange={(event: SelectChangeEvent) =>
                    setTokenVenta(event.target.value)
                  }
                >
                  <MenuItem value={'TODOS'}>{'TODOS'}</MenuItem>
                  {tokens.datos.map((token: Token) => (
                    <MenuItem key={token.ticker} value={token.ticker}>
                      {token.ticker}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              {/* TOKEN COMPRA */}
              <FormControl fullWidth>
                <InputLabel id="token-compra-input">Token Compra</InputLabel>
                <Select
                  labelId="token-compra-input"
                  id="token-compra"
                  value={tokenCompra}
                  label="token-compra"
                  onChange={(event: SelectChangeEvent) =>
                    setTokenCompra(event.target.value)
                  }
                >
                  <MenuItem value={'TODOS'}>{'TODOS'}</MenuItem>
                  {tokens.datos.map((token: Token) => (
                    <MenuItem key={token.ticker} value={token.ticker}>
                      {token.ticker}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs>
              <FormControl fullWidth>
                <InputLabel id="tipo-orden-input">Tipo</InputLabel>
                <Select
                  labelId="tipo-orden-input"
                  id="tipo-orden"
                  value={tipoOrden}
                  label="tipo-orden"
                  onChange={(event: SelectChangeEvent) =>
                    setTipoOrden(event.target.value)
                  }
                >
                  {TIPO_ORDEN.map((tipo: string, index) => (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="monto-venta-maximo"
                  label="Monto máximo de venta"
                  type="number"
                  value={montoMaximo}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setMontoMaximo(
                      Number(event.target.value) === 0
                        ? undefined
                        : Number(event.target.value)
                    )
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <Button
                variant="contained"
                sx={{ height: '100%', width: '100%' }}
                onClick={handleSincronizar}
              >
                {ordenes.cargando ? (
                  <CircularProgress size={24} sx={{ color: 'common.white' }} />
                ) : (
                  'Sincronizar'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {ordenes.cargando ? (
          <LinearProgress />
        ) : (
          <Divider sx={{ borderBottomWidth: 4 }} />
        )}

        <Box
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {ordenes.datos.length === 0 ? 'No hay ordenes' : ordenesRender}

          {ordenes.datos.length > 0 && (
            <Button
              variant="contained"
              color="info"
              sx={{ width: '60%', marginTop: 3 }}
              onClick={handleCargarMas}
            >
              {ordenes.cargando ? (
                <CircularProgress size={24} sx={{ color: 'common.white' }} />
              ) : (
                'Cargar más'
              )}
            </Button>
          )}
        </Box>
      </Box>
    </>
  )
}
