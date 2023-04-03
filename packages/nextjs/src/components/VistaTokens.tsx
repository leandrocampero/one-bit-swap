import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Estados, Token } from '@/types.d'
import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  Paper,
  Slide,
  TextField,
  Typography,
} from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import { TransitionProps } from '@mui/material/transitions'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import SelectIcon from './common/SelectIcon'
import WindowPaper from './common/WindowPaper'

/******************************************************************************/

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type AccionType = 'nuevo' | 'modificar'

/******************************************************************************/

export default function VistaTokens() {
  const { getters, actions } = useBlockchainContext()
  const { tokens, transaccion } = getters
  const {
    cargarTokens,
    activarToken,
    suspenderToken,
    nuevoToken,
    modificarOraculoToken,
  } = actions

  const [contrato, setContrato] = useState('')
  const [oraculo, setOraculo] = useState('')
  const [tokenModificar, setTokenModificar] = useState<string>('')
  const [accion, setAccion] = useState<AccionType>('nuevo')

  const [cadenaBusqueda, setCadenaBusqueda] = useState('')
  const [incluirSuspendidos, setIncluirSuspendidos] = useState<boolean>(true)
  const [preBusqueda, setPreBusqueda] = useState('')
  const [timeOut, setTimeOut] = useState<NodeJS.Timeout | undefined>(undefined)
  const [showModal, setShowModal] = useState<boolean>(false)

  /******************************************************************************/

  const handleOpenModalNuevo = useCallback(() => {
    setAccion('nuevo')

    setContrato('')
    setOraculo('')

    setShowModal(true)
  }, [])

  const handleOpenModalModificar = useCallback(
    ({ contrato, oraculo, ticker }: Token) => {
      setAccion('modificar')

      setContrato(contrato)
      setOraculo(oraculo)
      setTokenModificar(ticker)

      setShowModal(true)
    },
    []
  )

  const handleCloseModal = useCallback(async () => {
    setShowModal(false)
    setContrato('')
    setOraculo('')
    setTokenModificar('')
  }, [])

  /******************************************************************************/

  const handleRecargar = async () => {
    await cargarTokens(incluirSuspendidos)
  }

  const handleActivarToken = useCallback(
    async (ticker: string) => {
      await activarToken(ticker)
    },
    [activarToken]
  )

  const handleSuspenderToken = useCallback(
    async (ticker: string) => {
      await suspenderToken(ticker)
    },
    [suspenderToken]
  )

  const handleModificarToken = useCallback(async () => {
    await modificarOraculoToken(tokenModificar, oraculo)
    handleCloseModal()
  }, [modificarOraculoToken, handleCloseModal, tokenModificar, oraculo])

  const handleNuevoToken = useCallback(async () => {
    await nuevoToken(contrato, oraculo)
    handleCloseModal()
  }, [nuevoToken, handleCloseModal, contrato, oraculo])

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const cadena = event.target.value.trim()
      setPreBusqueda(cadena)

      if (timeOut) {
        clearTimeout(timeOut)
      }

      const timeOutId = setTimeout(() => {
        setCadenaBusqueda(cadena)
      }, 650)
      setTimeOut(timeOutId)
    },
    [timeOut]
  )

  /******************************************************************************/

  const handleContratoInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContrato(event.target.value.trim())
    },
    []
  )

  const handleOraculoInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setOraculo(event.target.value.trim())
    },
    []
  )

  const handleCheckInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIncluirSuspendidos(event.target.checked)
    },
    []
  )

  /****************************************************************************/

  const habilitarGuardarCambios = useMemo(() => {
    return !!contrato && !!oraculo
  }, [contrato, oraculo])

  const listarTokens = useMemo(() => {
    return tokens.datos
      .filter((token: Token) =>
        token.ticker.toLowerCase().includes(cadenaBusqueda)
      )
      .map((token: Token, index) => {
        return (
          <Paper
            key={index}
            elevation={3}
            sx={{
              paddingX: 2,
              paddingY: 1,
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${blueGrey[900]}`,
              ...(index !== 0 && { marginTop: 2 }),
            }}
          >
            <Grid container alignItems={'center'}>
              <Grid item xs={2} display={'flex'} alignItems={'center'}>
                <SelectIcon ticker={token.ticker} />
                <Typography
                  variant="h6"
                  color="initial"
                  sx={{ marginRight: 'auto', marginLeft: 1 }}
                >
                  {token.ticker}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2" color="initial">
                  {token.contrato}
                </Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography variant="button" fontSize={20}>
                  <Chip
                    variant="filled"
                    label={
                      token.estado === Estados.activo ? 'Activo' : 'Suspendido'
                    }
                    color={
                      token.estado === Estados.activo ? 'success' : 'error'
                    }
                    sx={{ width: '100%' }}
                  />
                </Typography>
              </Grid>

              <Grid item xs display={'flex'} justifyContent={'end'}>
                {token.estado === Estados.activo ? (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleSuspenderToken(token.ticker)}
                  >
                    {'Suspender'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleOpenModalModificar(token)}
                      sx={{ marginRight: 2 }}
                    >
                      {'Modificar'}
                    </Button>

                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleActivarToken(token.ticker)}
                    >
                      {'Activar'}
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
        )
      })
  }, [
    tokens.datos,
    cadenaBusqueda,
    handleActivarToken,
    handleSuspenderToken,
    handleOpenModalModificar,
  ])

  /******************************************************************************/

  useEffect(() => {
    const { error, cargando } = transaccion
    if (!error && !cargando) {
      cargarTokens(incluirSuspendidos)
    }
  }, [transaccion, cargarTokens, incluirSuspendidos])

  /******************************************************************************/

  return (
    <>
      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xs"
        fullWidth
        onClose={handleCloseModal}
        aria-describedby="dialogo-editar-token"
      >
        <DialogTitle
          sx={{
            backgroundColor: 'primary.main',
            color: 'common.white',
            marginBottom: 2,
            textTransform: 'capitalize',
          }}
          id="dialogo-editar-token"
        >
          {`${accion} token`}
        </DialogTitle>

        <DialogContent>
          <FormControl sx={{ marginTop: 1 }} fullWidth variant="outlined">
            <TextField
              id="token-contrato"
              label="Dirección del contrato"
              type="text"
              value={contrato}
              disabled={accion === 'modificar'}
              onChange={handleContratoInputChange}
            />
          </FormControl>

          <FormControl sx={{ marginTop: 2 }} fullWidth variant="outlined">
            <TextField
              id="token-oraculo"
              label="Dirección del oráculo"
              type="text"
              value={oraculo}
              onChange={handleOraculoInputChange}
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Cerrar
          </Button>

          <Button
            onClick={
              accion === 'nuevo' ? handleNuevoToken : handleModificarToken
            }
            variant="contained"
            color="success"
            disabled={!habilitarGuardarCambios}
          >
            {transaccion.cargando ? (
              <CircularProgress size={24} sx={{ color: 'common.white' }} />
            ) : (
              accion
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <TextField
              id="cadena-busqueda"
              label="Buscar token"
              type="text"
              value={preBusqueda}
              onChange={handleSearchInputChange}
            />
          </FormControl>
        </Grid>

        <Grid item xs={2} display={'flex'} alignItems={'center'}>
          <FormControlLabel
            label="Incluir suspendidos"
            control={
              <Checkbox
                checked={incluirSuspendidos}
                onChange={handleCheckInput}
              />
            }
          />
        </Grid>

        <Grid item xs={2}>
          <Button
            variant="contained"
            sx={{ height: '100%', width: '100%' }}
            onClick={handleRecargar}
          >
            {tokens.cargando ? (
              <CircularProgress size={24} sx={{ color: 'common.white' }} />
            ) : (
              'Recargar'
            )}
          </Button>
        </Grid>

        <Grid item xs={2}>
          <Button
            variant="contained"
            color="success"
            sx={{ height: '100%', width: '100%' }}
            onClick={handleOpenModalNuevo}
          >
            {transaccion.cargando ? (
              <CircularProgress size={24} sx={{ color: 'common.white' }} />
            ) : (
              'Nuevo'
            )}
          </Button>
        </Grid>
      </Grid>

      {tokens.cargando || transaccion.cargando ? (
        <LinearProgress sx={{ marginY: 3 }} />
      ) : (
        <Divider sx={{ borderBottomWidth: 4, marginY: 3 }} />
      )}

      <WindowPaper>{listarTokens}</WindowPaper>
    </>
  )
}
