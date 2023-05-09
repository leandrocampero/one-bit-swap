import { useBlockchainContext } from '@/context/BlockchainProvider'
import { useSessionContext } from '@/context/SessionProvider'
import deploy from '@/contracts/deploy.json'
import networks from '@/contracts/networks'
import tokens from '@/contracts/tokens.json'
import { Estados, RolesBilleteras, Token } from '@/types.d'
import { simpleAddress } from '@/utils/helpers'
import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { blue, blueGrey, green, grey } from '@mui/material/colors'
import { TransitionProps } from '@mui/material/transitions'
import { BigNumber, ethers } from 'ethers'
import Link from 'next/link'
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import SelectIcon from './common/SelectIcon'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const faucetHabilitado = process.env.NEXT_PUBLIC_FAUCET_ENABLED === 'true'

export default function Navbar() {
  const { disconnect, connected, addAsset } = useSessionContext()
  const { getters, actions } = useBlockchainContext()
  const { sesion, transaccion } = getters
  const { emitirTokens, consultarCredito, aprobarDeposito } = actions

  const [showModal, setShowModal] = useState<boolean>(false)
  const [allowance, setAllowance] = useState<BigNumber | undefined>(undefined)
  const [token, setToken] = useState<string>('')

  const isLgAndUp = useMediaQuery('(min-width:1200px)')

  /****************************************************************************/

  const mapTokens = useMemo((): { [key: string]: Token } => {
    return tokens.reduce(
      (objeto, token) => ({ ...objeto, [token.contrato]: { ...token } }),
      {}
    )
  }, [])

  const handleOpenModal = useCallback(() => {
    setShowModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setToken('')
    setAllowance(undefined)
  }, [])

  const handleEmitirTokens = useCallback(async () => {
    await emitirTokens(token)
    addAsset(mapTokens[token])
  }, [emitirTokens, addAsset, token, mapTokens])

  const handleAprobarTokens = useCallback(async () => {
    await aprobarDeposito(token)
  }, [aprobarDeposito, token])

  const userData = useMemo(() => {
    let rol

    switch (sesion.datos.rol) {
      case RolesBilleteras.administrador:
        rol = 'Administrador'
        break
      case RolesBilleteras.propietario:
        rol = 'Propietario'
        break
      default:
        rol = 'Billetera'
        break
    }

    const address = sesion.datos.direccion
    return `${rol}: ${simpleAddress(address)}`
  }, [sesion])

  const blockExplorer = useMemo(() => {
    const mode = process.env.NEXT_PUBLIC_NETWORK_MODE as keyof typeof networks
    const networkToSwitch = networks[mode]
    const { blockExplorerUrls } = networkToSwitch

    return blockExplorerUrls[0]
  }, [])

  /****************************************************************************/

  useEffect(() => {
    const awaitConsultarSaldo = async () => {
      const saldo = await consultarCredito(token)

      setAllowance(saldo)
    }

    if (token && !transaccion.cargando) {
      awaitConsultarSaldo()
    }
  }, [token, consultarCredito, transaccion])

  /****************************************************************************/

  return (
    <>
      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xs"
        fullWidth
        onClose={handleCloseModal}
        aria-describedby="dialog-ejecutar-orden"
      >
        <DialogTitle
          sx={{
            backgroundColor: 'info.main',
            color: 'common.white',
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          id="dialog-ejecutar-orden"
        >
          <span>{`Emitir tokens`}</span>

          <IconButton
            aria-label="close"
            sx={{ color: 'common.white' }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Paper
            variant="outlined"
            sx={{
              backgroundColor: grey['100'],
              padding: 2,
            }}
          >
            <Typography variant="body2">
              Para poder operar en la plataforma, podes emetir tokens (sin valor
              comercial) a tu billetera para probar
            </Typography>
          </Paper>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id="token-emitir">Token Venta</InputLabel>
            <Select
              labelId="token-emitir"
              id="token-select"
              value={token}
              label="token-venta"
              onChange={(event: SelectChangeEvent) =>
                setToken(event.target.value)
              }
              sx={{
                '.MuiSelect-select': { display: 'flex', alignItems: 'center' },
              }}
            >
              {tokens.map((token) => (
                <MenuItem key={token.ticker} value={token.contrato}>
                  <SelectIcon ticker={token.ticker} />
                  <Typography variant="body1" color="initial" marginLeft={1}>
                    {token.ticker}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {token && (
            <Paper
              variant="outlined"
              sx={{
                backgroundColor: green[50],
                padding: 2,
                marginTop: 2,
              }}
            >
              <Typography variant="body1">
                {'Emitir 1000 tokens a la dirección:'}
              </Typography>

              <Typography
                variant="inherit"
                color="initial"
                sx={{ color: grey[700], textAlign: 'center' }}
              >
                {`${sesion.datos.direccion}`}
              </Typography>

              <Divider sx={{ marginY: 1 }} />

              <Typography variant="body2">
                {'Confirmar emición de 1000 tokens'}
              </Typography>

              <Button
                onClick={handleEmitirTokens}
                variant="contained"
                color="success"
                sx={{ marginTop: 1, width: '100%' }}
              >
                {transaccion.cargando ? (
                  <CircularProgress size={24} sx={{ color: 'common.white' }} />
                ) : (
                  'Emitir'
                )}
              </Button>
            </Paper>
          )}

          {allowance && (
            <Paper
              variant="outlined"
              sx={{
                backgroundColor: blue[50],
                padding: 2,
                marginTop: 2,
              }}
            >
              <Typography variant="body2">
                {allowance.isZero() ? (
                  <span>
                    El token seleccionado no tiene monto aprobado para que la
                    plataforma trasnfiera desde la billetera hacia el contrato.
                    Hace click en aprobar para poder continuar
                  </span>
                ) : (
                  <span>
                    {`La billetera tiene ${ethers.utils
                      .formatUnits(allowance)
                      .toString()} tokens aprobados.`}
                  </span>
                )}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2">
                Confirmar aprobación de 1000 para gastar desde el contrato de la
                plataforma
              </Typography>

              <Button
                onClick={handleAprobarTokens}
                variant="contained"
                color="info"
                sx={{ marginTop: 1, width: '100%' }}
              >
                {transaccion.cargando ? (
                  <CircularProgress size={24} sx={{ color: 'common.white' }} />
                ) : (
                  'Aprobar'
                )}
              </Button>
            </Paper>
          )}
        </DialogContent>
      </Dialog>

      <AppBar position="fixed">
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar>
            <Container maxWidth={false}>
              <Grid
                container
                spacing={1}
                direction={'row'}
                alignItems={'center'}
              >
                <Grid item>
                  <Typography variant="h4" noWrap>
                    <Link href={connected ? '/intercambiar' : '/'}>
                      RoyalSwap
                    </Link>
                  </Typography>

                  {!isLgAndUp && connected && sesion.datos.direccion && (
                    <Link
                      href={`${blockExplorer}/address/${sesion.datos.direccion}`}
                      target="_blank"
                    >
                      <Typography
                        variant="button"
                        sx={{ color: 'common.white', fontWeight: 'bold' }}
                      >
                        {userData}
                      </Typography>
                    </Link>
                  )}
                </Grid>

                {isLgAndUp && connected && sesion.datos.direccion && (
                  <>
                    <Grid item marginLeft={2}>
                      <Divider
                        orientation="vertical"
                        sx={{
                          height: 30,
                          borderColor: 'common.white',
                        }}
                      />
                    </Grid>

                    <Grid item>
                      <Link
                        href={`${blockExplorer}/address/${sesion.datos.direccion}`}
                        target="_blank"
                      >
                        <Typography
                          variant="button"
                          sx={{ color: 'common.white', fontWeight: 'bold' }}
                        >
                          {userData}
                        </Typography>
                      </Link>
                    </Grid>
                  </>
                )}

                {connected && sesion.datos.estado === Estados.suspendido && (
                  <Grid item>
                    <Chip
                      label="Suspendido"
                      color="error"
                      sx={{ fontWeight: 'bold', fontSize: 14 }}
                    />
                  </Grid>
                )}

                <Grid item marginRight={'auto'} />

                <Grid item>
                  <Link
                    href={`${blockExplorer}/address/${deploy.platform}#code`}
                    target="_blank"
                  >
                    <Button
                      variant="outlined"
                      color="info"
                      sx={{
                        '&.MuiButton-outlinedInfo': {
                          borderColor: 'common.white',
                          color: 'common.white',
                        },
                      }}
                    >
                      {'Ir al Contrato'}
                    </Button>
                  </Link>
                </Grid>

                {connected && <Grid item marginRight={'auto'} />}

                {connected && sesion.datos.rol !== RolesBilleteras.usuario ? (
                  <Grid item>
                    <Button
                      id="demo-customized-button"
                      variant="contained"
                      disableElevation
                      startIcon={<SettingsIcon />}
                    >
                      <Link href="/configuracion">Configuracion</Link>
                    </Button>
                  </Grid>
                ) : null}

                {connected && faucetHabilitado && (
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={handleOpenModal}
                      sx={{
                        '&.MuiButton-containedPrimary': {
                          backgroundColor: 'common.white',
                          color: 'common.black',
                        },
                        '&.MuiButton-containedPrimary:hover': {
                          backgroundColor: blueGrey[100],
                        },
                      }}
                    >
                      Recibir tokens
                    </Button>
                  </Grid>
                )}

                {connected && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={disconnect}
                    >
                      Desconectar
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Container>
          </Toolbar>
        </Box>
      </AppBar>
    </>
  )
}
