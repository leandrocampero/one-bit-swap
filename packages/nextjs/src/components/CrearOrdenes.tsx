import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Orden, TiposOrdenes, Token } from '@/types.d'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { grey, lightBlue, lightGreen } from '@mui/material/colors'
import { TransitionProps } from '@mui/material/transitions'
import { Box } from '@mui/system'
import { ethers } from 'ethers'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import { ContainerBox, FlexBoxSpaceBetween } from './common/styles'
/******************************************************************************/

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const TIPO_ORDEN = ['Compra-Venta', 'Intercambio']

/******************************************************************************/

export default function CrearOrdenes() {
  const { getters, actions } = useBlockchainContext()

  const [tipoOrden, setTipoOrden] = useState<number>(0)
  const [tokenVenta, setTokenVenta] = useState<string>('')
  const [tokenCompra, setTokenCompra] = useState<string>('')
  const [montoVenta, setMontoVenta] = useState<string>('')
  const [montoCompra, setMontoCompra] = useState<string>('')
  const [montoCompraPosible, setMontoCompraPosible] = useState<string>('')

  const [showModal, setShowModal] = useState<boolean>(false)
  const [ordenEspejo, setOrdenEspejo] = useState<Orden | undefined>(undefined)

  const { tokens, transaccion } = getters
  const { nuevaOrden, ejecutarOrden, buscarOrdenEspejo, consultarCotizacion } =
    actions

  /****************************************************************************/

  const handleOpenModal = useCallback(async () => {
    let montoCompraCrudo = ''
    let consultaOrdenEspejo: Awaited<ReturnType<typeof buscarOrdenEspejo>>

    if (tipoOrden === TiposOrdenes.compraVenta) {
      consultaOrdenEspejo = await buscarOrdenEspejo(
        tokenCompra,
        tokenVenta,
        ethers.utils.parseUnits(tipoOrden === 0 ? montoCompra : '0').toString(),
        ethers.utils.parseUnits(montoVenta).toString()
      )

      if (
        consultaOrdenEspejo &&
        consultaOrdenEspejo.idOrden !== ethers.constants.HashZero
      ) {
        setOrdenEspejo({
          ...consultaOrdenEspejo,
          montoVenta: ethers.utils.formatUnits(consultaOrdenEspejo.montoVenta),
          montoCompra: ethers.utils.formatUnits(
            consultaOrdenEspejo.montoCompra
          ),
        })
      }

      montoCompraCrudo = montoCompra
    } else {
      setOrdenEspejo(undefined)

      const monto = await consultarCotizacion(
        tokenVenta,
        tokenCompra,
        ethers.utils.parseUnits(montoVenta).toString()
      )

      const montoCompraParsed = ethers.utils.formatUnits(monto ?? '0')
      montoCompraCrudo =
        montoCompraParsed.split('.')[1].length > 6
          ? parseFloat(montoCompraParsed).toFixed(6)
          : montoCompraParsed
    }

    setMontoCompraPosible(montoCompraCrudo)
    setShowModal(true)
  }, [
    consultarCotizacion,
    buscarOrdenEspejo,
    tokenVenta,
    tokenCompra,
    montoVenta,
    montoCompra,
    tipoOrden,
  ])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setOrdenEspejo(undefined)
  }, [])

  const handleNuevaOrden = useCallback(async () => {
    await nuevaOrden(
      tokenCompra,
      tokenVenta,
      tipoOrden === TiposOrdenes.compraVenta ? montoCompra : '0',
      montoVenta,
      tipoOrden
    )

    await handleCloseModal()
  }, [
    tokenVenta,
    tokenCompra,
    montoVenta,
    montoCompra,
    tipoOrden,
    nuevaOrden,
    handleCloseModal,
  ])

  const handleEjecutarOrden = useCallback(async () => {
    if (!ordenEspejo) return

    await ejecutarOrden(ordenEspejo.idOrden)

    await handleCloseModal()
  }, [ordenEspejo, ejecutarOrden, handleCloseModal])

  /****************************************************************************/

  const habilidarOperacion = useMemo(() => {
    return (
      tokenVenta !== '' &&
      tokenCompra !== '' &&
      montoVenta !== '' &&
      (tipoOrden === 1 || montoCompra !== '')
    )
  }, [tokenVenta, tokenCompra, montoVenta, montoCompra, tipoOrden])

  const ModalContent = useMemo(() => {
    const titulo = `Crear orden de ${TIPO_ORDEN[tipoOrden]}`

    return (
      <>
        <DialogTitle
          sx={{
            backgroundColor: 'primary.light',
            color: 'common.white',
            marginBottom: 2,
          }}
          id="dialog-ejecutar-orden"
        >
          {titulo}
        </DialogTitle>
        <DialogContent>
          {ordenEspejo && (
            <Paper
              variant="outlined"
              sx={{
                backgroundColor: lightGreen['50'],
                padding: 2,
                marginBottom: 2,
              }}
            >
              {'Antes de crear una nueva orden: '}
            </Paper>
          )}
          <Typography variant="h6" sx={FlexBoxSpaceBetween}>
            <span>{'Se entrega:'}</span>
            <span>{`${tokenVenta} ${montoVenta}`}</span>
          </Typography>

          <Typography variant="h6" sx={FlexBoxSpaceBetween}>
            <span>{'A cambio de:'}</span>
            <span>{`${tokenCompra} ${montoCompraPosible}`}</span>
          </Typography>
          {tipoOrden === TiposOrdenes.intercambio && (
            <Paper
              variant="outlined"
              sx={{
                backgroundColor: grey['100'],
                padding: 2,
                marginTop: 2,
              }}
            >
              <Typography variant="body2">
                El valor posible del monto de compra es una estimación, ya que
                este va a depender de la cotización del par de tokens al momento
                de la ejecución
              </Typography>
            </Paper>
          )}

          {ordenEspejo && (
            <>
              <Paper
                variant="outlined"
                sx={{
                  backgroundColor: lightBlue['50'],
                  padding: 2,
                  marginY: 2,
                }}
              >
                {'Te podría interesar ejecutar esta otra: '}
              </Paper>
              <Typography variant="h6" sx={FlexBoxSpaceBetween}>
                <span>{'Se entrega:'}</span>
                <span>{`${ordenEspejo.tokenVenta} ${ordenEspejo.montoVenta}`}</span>
              </Typography>

              <Typography variant="h6" sx={FlexBoxSpaceBetween}>
                <span>{'A cambio de:'}</span>
                <span>{`${ordenEspejo.tokenCompra} ${ordenEspejo.montoCompra}`}</span>
              </Typography>
            </>
          )}
        </DialogContent>
        <Divider sx={{ marginBottom: 2 }} />
        <DialogActions>
          <Stack spacing={1} sx={{ width: '100%' }}>
            {ordenEspejo && (
              <Button
                onClick={handleEjecutarOrden}
                variant="contained"
                color="info"
                sx={{ width: '100%' }}
              >
                {transaccion.cargando ? (
                  <CircularProgress size={24} sx={{ color: 'common.white' }} />
                ) : (
                  'Ejecutar orden propuesta'
                )}
              </Button>
            )}

            <Button
              onClick={handleNuevaOrden}
              variant="contained"
              color="success"
              sx={{ width: '100%' }}
            >
              {transaccion.cargando ? (
                <CircularProgress size={24} sx={{ color: 'common.white' }} />
              ) : (
                'Crear nueva orden'
              )}
            </Button>

            <Button
              onClick={handleCloseModal}
              variant="outlined"
              sx={{ width: '100%' }}
            >
              Cerrar
            </Button>
          </Stack>
        </DialogActions>
      </>
    )
  }, [
    handleCloseModal,
    handleEjecutarOrden,
    handleNuevaOrden,
    montoCompraPosible,
    montoVenta,
    ordenEspejo,
    tipoOrden,
    tokenCompra,
    tokenVenta,
    transaccion.cargando,
  ])

  /****************************************************************************/

  return (
    <>
      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xs"
        fullWidth
        onClose={undefined}
        aria-describedby="dialog-ejecutar-orden"
      >
        {ModalContent}
      </Dialog>

      <Box sx={ContainerBox}>
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', textTransform: 'uppercase' }}
        >
          {'Crear orden'}
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        <Box sx={{ marginBottom: 4 }}>
          <FormControl fullWidth>
            <FormLabel id="seleccionar-tipo-orden">
              Seleccionar tipo de orden
            </FormLabel>
            <RadioGroup
              aria-labelledby="seleccionar-tipo-orden"
              name="tipo-orden"
              value={tipoOrden}
              onChange={(event) => setTipoOrden(Number(event.target.value))}
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="Compra-Venta"
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Intercambio"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {tokens.cargando && (
          <Box sx={{ width: '100%', marginBottom: 4 }}>
            <LinearProgress />
          </Box>
        )}

        <Box sx={{ marginBottom: 4 }}>
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
              {tokens.datos.map((token: Token) => (
                <MenuItem key={token.ticker} value={token.ticker}>
                  {token.ticker}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: 4 }}>
          <TextField
            fullWidth
            label="Monto venta"
            variant="filled"
            focused
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(event) => setMontoVenta(event.target.value)}
          />
        </Box>

        <Box sx={{ marginBottom: 4 }}>
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
              {tokens.datos.map((token: Token) => (
                <MenuItem key={token.ticker} value={token.ticker}>
                  {token.ticker}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {tipoOrden == 0 && (
          <Box sx={{ marginBottom: 4 }}>
            <TextField
              fullWidth
              label="Monto compra"
              variant="filled"
              focused
              value={montoCompra}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              onChange={(event) => setMontoCompra(event.target.value)}
            />
          </Box>
        )}

        <Button
          variant="contained"
          sx={{ width: '100%' }}
          disabled={!habilidarOperacion}
          onClick={handleOpenModal}
        >
          {transaccion.cargando ? (
            <CircularProgress size={24} sx={{ color: 'common.white' }} />
          ) : (
            'Crear orden'
          )}
        </Button>
      </Box>
    </>
  )
}
