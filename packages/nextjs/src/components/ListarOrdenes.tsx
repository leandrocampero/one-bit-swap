import { useBlockchainContext } from '@/context/BlockchainProvider'
import { EstadosOrdenes, Orden, TiposOrdenes, Token } from '@/types.d'
import { simpleAddress } from '@/utils/helpers'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slide,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { TransitionProps } from '@mui/material/transitions'
import { BigNumber, ethers } from 'ethers'
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import TarjetaOrden from './Ordenes/TarjetaOrden'
import WindowPaper from './common/WindowPaper'
import { ContainerBox, FlexBoxSpaceBetween } from './common/styles'

/******************************************************************************/

const ID_TAB_PANEL = 'ordenes-tabpanel'
const ARIA_LABEL_PANEL = 'ordenes-tab'
const NAV_ITEMS = ['Ordenes activas', 'Mis ordenes', 'Historial']
const TIPO_ORDEN = ['Compra-Venta', 'Intercambio']

const a11yProps = (index: number) => {
  return {
    id: `${ID_TAB_PANEL}-${index}`,
    'aria-controls': `${ARIA_LABEL_PANEL}-${index}`,
  }
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

/******************************************************************************/

export default function ListarOrdenes() {
  const { getters, actions } = useBlockchainContext()

  const [tokenVenta, setTokenVenta] = useState<string>('-')
  const [tokenCompra, setTokenCompra] = useState<string>('-')
  const [tipoOrden, setTipoOrden] = useState<string>('-')
  const [montoMaximo, setMontoMaximo] = useState<number | undefined>()

  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | undefined>(
    undefined
  )
  const [ultimaOrden, setUltimaOrden] = useState<string | undefined>(undefined)

  const [tab, setTab] = useState(0)
  const [showModalEjecutar, setShowModalEjecutar] = useState<boolean>(false)
  const [showModalCancelar, setShowModalCancelar] = useState<boolean>(false)

  const [preMontoMaximo, setPreMontoMaximo] = useState<number | undefined>()
  const [timeOut, setTimeOut] = useState<NodeJS.Timeout | undefined>(undefined)

  const { ordenes, tokens, transaccion, sesion } = getters
  const {
    cargarOrdenesActivas,
    consultarCotizacion,
    ejecutarOrden,
    cancelarOrden,
    cargarOrdenesPropias,
  } = actions

  const cargarMás = useMemo(() => {
    const length = ordenes.datos.length
    return ordenes.datos.length
      ? ordenes.datos[length - 1].idOrden !== ultimaOrden
      : true
  }, [ordenes.datos, ultimaOrden])

  const ordenesObjeto = useMemo(
    () =>
      ordenes.datos.reduce(
        (objeto, orden) => ({
          ...objeto,
          [orden.idOrden as string]: { ...orden },
        }),
        {} as { [id: string]: Orden }
      ),
    [ordenes]
  )

  /****************************************************************************/

  const handleCargarMas = useCallback(() => {
    const cantidadOrdenes = ordenes.datos.length
    const ultimaOrden =
      (cantidadOrdenes !== 0 && ordenes.datos[cantidadOrdenes - 1].idOrden) ||
      ethers.constants.HashZero

    setUltimaOrden(ultimaOrden)
    cargarOrdenesActivas(ultimaOrden)
  }, [ordenes, cargarOrdenesActivas])

  const handleSincronizar = useCallback(async () => {
    await cargarOrdenesActivas(ethers.constants.HashZero)
  }, [cargarOrdenesActivas])

  const handleOpenModal = useCallback(
    async (idOrden: string, operacion: 'ejecutar' | 'cancelar') => {
      let montoCompra = ''
      const orden = ordenesObjeto[idOrden]
      if (ordenesObjeto[idOrden].tipo === TiposOrdenes.intercambio) {
        const monto = await consultarCotizacion(
          orden.tokenVenta,
          orden.tokenCompra,
          orden.montoVenta
        )

        const montoCompraParsed = ethers.utils.formatEther(monto ?? '0')
        montoCompra =
          montoCompraParsed.split('.')[1].length > 6
            ? parseFloat(montoCompraParsed).toFixed(6)
            : montoCompraParsed
      } else {
        montoCompra = ethers.utils.formatUnits(orden.montoCompra)
      }

      setOrdenSeleccionada({
        ...ordenesObjeto[idOrden],
        montoCompra,
        montoVenta: ethers.utils.formatUnits(orden.montoVenta),
        fechaCreacion: new Date(
          Number(orden.fechaCreacion) * 1000
        ).toLocaleString(),
      })

      if (operacion === 'ejecutar') {
        setShowModalEjecutar(true)
      } else {
        setShowModalCancelar(true)
      }
    },
    [setShowModalEjecutar, ordenesObjeto, consultarCotizacion]
  )

  const handleCloseModal = useCallback(async () => {
    setOrdenSeleccionada(undefined)
    setShowModalEjecutar(false)
    setShowModalCancelar(false)
  }, [setShowModalEjecutar])

  const handleEjecutarOrden = useCallback(async () => {
    await ejecutarOrden(ordenSeleccionada!.idOrden)

    await handleSincronizar()
    setOrdenSeleccionada(undefined)
    setShowModalEjecutar(false)
  }, [
    setShowModalEjecutar,
    handleSincronizar,
    ejecutarOrden,
    ordenSeleccionada,
  ])

  const handleCancelarOrden = useCallback(async () => {
    await cancelarOrden(ordenSeleccionada!.idOrden)

    await cargarOrdenesPropias()
    setOrdenSeleccionada(undefined)
    setShowModalCancelar(false)
  }, [
    setShowModalCancelar,
    cargarOrdenesPropias,
    cancelarOrden,
    ordenSeleccionada,
  ])

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPreMontoMaximo(
        Number(event.target.value) === 0
          ? undefined
          : Number(event.target.value)
      )

      if (timeOut) {
        clearTimeout(timeOut)
      }

      const timeOutId = setTimeout(() => {
        setMontoMaximo(
          Number(event.target.value) === 0
            ? undefined
            : Number(event.target.value)
        )
      }, 650)
      setTimeOut(timeOutId)
    },
    [timeOut]
  )

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, newValue: number) => {
      setTab(newValue)

      if (newValue === 0) {
        await handleSincronizar()
      } else if (tab === 0) {
        await cargarOrdenesPropias()
      }
    },
    [tab, handleSincronizar, cargarOrdenesPropias]
  )

  /****************************************************************************/

  const ordenesRender = useMemo(() => {
    return ordenes.datos
      .filter(
        (orden) =>
          (tokenVenta === '-' || orden.tokenVenta === tokenVenta) &&
          (tokenCompra === '-' || orden.tokenCompra === tokenCompra) &&
          (tipoOrden === '-' || TIPO_ORDEN[orden.tipo] === tipoOrden) &&
          (!montoMaximo ||
            BigNumber.from(orden.montoVenta).lte(
              ethers.utils.parseUnits(montoMaximo.toString())
            )) &&
          (tab === 0 ||
            ((tab !== 1 || orden.estado === EstadosOrdenes.activa) &&
              (tab !== 2 || orden.estado !== EstadosOrdenes.activa)))
      )
      .map((orden, index) => (
        <TarjetaOrden
          key={orden.idOrden}
          orden={orden}
          sx={{ ...(index !== 0 && { marginTop: 3 }) }}
          deshabilitarAccion={
            tab === 0 && sesion.datos.direccion === orden.vendedor
          }
          onAccion={handleOpenModal}
        />
      ))
  }, [
    ordenes,
    montoMaximo,
    tokenCompra,
    tokenVenta,
    tipoOrden,
    tab,
    sesion,
    handleOpenModal,
  ])

  const vistaOrdenesActivas = useMemo(() => {
    return tab === 0
  }, [tab])

  /****************************************************************************/

  useEffect(() => {
    handleSincronizar()
    //eslint-disable-next-line
  }, [])

  /****************************************************************************/

  return (
    <>
      <Dialog
        open={showModalEjecutar}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xs"
        fullWidth
        onClose={undefined}
        aria-describedby="dialog-ejecutar-orden"
      >
        {ordenSeleccionada === undefined ? (
          '-'
        ) : (
          <>
            <DialogTitle
              sx={{
                backgroundColor: 'primary.main',
                color: 'common.white',
                marginBottom: 2,
              }}
              id="dialog-ejecutar-orden"
            >
              {`Ejecutar orden de ${TIPO_ORDEN[ordenSeleccionada.tipo]}`}
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" sx={FlexBoxSpaceBetween}>
                <span>{'Se entrega:'}</span>
                <span>{`${ordenSeleccionada.tokenVenta} ${ordenSeleccionada.montoVenta}`}</span>
              </Typography>

              <Typography variant="h6" sx={FlexBoxSpaceBetween}>
                <span>{'A cambio de:'}</span>
                <span>
                  {`${ordenSeleccionada.tokenCompra} ${ordenSeleccionada.montoCompra}`}
                </span>
              </Typography>

              <Typography variant="h6" sx={FlexBoxSpaceBetween}>
                <span>{'Creada en:'}</span>
                <span>{`${ordenSeleccionada.fechaCreacion}`}</span>
              </Typography>

              <Typography variant="h6" sx={FlexBoxSpaceBetween}>
                <span>{'Creador:'}</span>
                <span>{`${simpleAddress(ordenSeleccionada.vendedor)}`}</span>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} variant="outlined">
                Cerrar
              </Button>

              <Button
                onClick={handleEjecutarOrden}
                variant="contained"
                color="success"
              >
                {transaccion.cargando ? (
                  <CircularProgress size={24} sx={{ color: 'common.white' }} />
                ) : (
                  'Ejecutar'
                )}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={showModalCancelar}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xs"
        fullWidth
        onClose={undefined}
        aria-describedby="dialog-cancelar-orden"
      >
        {ordenSeleccionada === undefined ? (
          '-'
        ) : (
          <>
            <DialogTitle
              sx={{
                backgroundColor: 'error.main',
                color: 'common.white',
                marginBottom: 2,
              }}
              id="dialog-cancelar-orden"
            >
              {`Cancelar orden de ${TIPO_ORDEN[ordenSeleccionada.tipo]}`}
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" sx={FlexBoxSpaceBetween}>
                <span>{'Se entrega:'}</span>
                <span>{`${ordenSeleccionada.tokenVenta} ${ordenSeleccionada.montoVenta}`}</span>
              </Typography>

              <Typography variant="h6" sx={FlexBoxSpaceBetween}>
                <span>{'A cambio de:'}</span>
                <span>
                  {`${ordenSeleccionada.tokenCompra} ${ordenSeleccionada.montoCompra}`}
                </span>
              </Typography>

              <Typography
                variant="h6"
                sx={{ textAlign: 'center', marginTop: 2 }}
              >
                {'¿Está seguro que desea cancelar esta orden?'}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} variant="outlined">
                Cerrar
              </Button>

              <Button
                onClick={handleCancelarOrden}
                variant="contained"
                color="error"
              >
                {transaccion.cargando ? (
                  <CircularProgress size={24} sx={{ color: 'common.white' }} />
                ) : (
                  'Cancelar'
                )}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Box sx={{ ...ContainerBox, padding: 0, height: '100%' }}>
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
            sx={{ '&.MuiTabsindicator': 'primary.dark' }}
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
                  <MenuItem value={'-'}>{'-'}</MenuItem>
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
                  <MenuItem value={'-'}>{'-'}</MenuItem>
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
                  <MenuItem value={'-'}>{'-'}</MenuItem>
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
                  value={preMontoMaximo}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              {tab === 0 ? (
                <Button
                  variant="contained"
                  sx={{ height: '100%', width: '100%' }}
                  onClick={handleSincronizar}
                >
                  {ordenes.cargando ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: 'common.white' }}
                    />
                  ) : (
                    'Recargar'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ height: '100%', width: '100%' }}
                  onClick={cargarOrdenesPropias}
                >
                  {ordenes.cargando ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: 'common.white' }}
                    />
                  ) : (
                    'Sincronizar'
                  )}
                </Button>
              )}
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
          }}
        >
          <WindowPaper>
            {ordenes.datos.length === 0 ? 'No hay ordenes' : ordenesRender}

            {ordenes.datos.length > 0 && vistaOrdenesActivas && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="info"
                  sx={{ width: '60%', marginTop: 3 }}
                  disabled={!cargarMás}
                  onClick={handleCargarMas}
                >
                  {ordenes.cargando ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: 'common.white' }}
                    />
                  ) : (
                    'Cargar más'
                  )}
                </Button>
              </Box>
            )}
          </WindowPaper>
        </Box>
      </Box>
    </>
  )
}
