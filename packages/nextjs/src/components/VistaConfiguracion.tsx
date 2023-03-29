import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Estados, RolesBilleteras } from '@/types.d'
import {
  Alert,
  Box,
  Button,
  CardProps,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { FlexBoxSpaceBetween } from './common/styles'

/******************************************************************************/

interface InfoCardProps extends CardProps {
  header: string
  loading: boolean
}

const InfoCard = ({ children, sx, header, loading }: InfoCardProps) => (
  <Paper
    sx={{
      width: '100%',
      border: `1px solid ${blueGrey[900]}`,
      overflow: 'hidden',
      minHeight: 200,
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      ...sx,
    }}
    elevation={3}
  >
    <Box
      sx={{
        backgroundColor: 'primary.main',
        paddingY: 1,
        paddingX: 3,
      }}
    >
      <Typography
        variant="button"
        color="initial"
        sx={{ fontWeight: 'bold', color: 'common.white' }}
      >
        {header}
      </Typography>
    </Box>

    {loading ? (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <CircularProgress size={64} sx={{ color: 'primary.main' }} />
      </Box>
    ) : (
      <Box sx={{ padding: 3, flexGrow: 1 }}>{children}</Box>
    )}
  </Paper>
)

/******************************************************************************/

export default function VistaConfiguracion() {
  const { getters, actions } = useBlockchainContext()
  const { plataforma, transaccion, sesion } = getters
  const {
    bloquearPlataforma,
    desbloquearPlataforma,
    cambiarMontoMinimoPlataforma,
    cargarDatosPlataforma,
  } = actions

  const [montoMinimo, setMontoMinimo] = useState<string>('')

  /****************************************************************************/

  const handleCambiarMontoMinimoText = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMontoMinimo(evt.target.value.trim())
  }

  const handleCambiarMontoMinimoButton = async () => {
    await cambiarMontoMinimoPlataforma(montoMinimo)
    setMontoMinimo('')
  }

  const handleCambiarEstadoPlataforma = async () => {
    if (plataforma.datos.estado === Estados.activo) {
      await bloquearPlataforma()
    } else {
      await desbloquearPlataforma()
    }
  }

  /****************************************************************************/

  useEffect(() => {
    const { error, cargando } = transaccion
    if (!error && !cargando) {
      cargarDatosPlataforma()
    }
  }, [transaccion, cargarDatosPlataforma])

  /****************************************************************************/

  return (
    <>
      <Grid container spacing={2} alignItems={'stretch'}>
        <Grid item xs={6}>
          <InfoCard
            header="Estado de la Plataforma"
            loading={plataforma.cargando}
            sx={{ height: '100%' }}
          >
            <Alert
              variant="filled"
              elevation={1}
              severity={
                plataforma.datos.estado == Estados.suspendido
                  ? 'warning'
                  : 'success'
              }
            >
              <Typography
                variant="body1"
                color="initial"
                sx={{ fontWeight: 'medium', color: 'common.white' }}
              >
                {plataforma.datos.estado == Estados.suspendido
                  ? 'Plataforma suspendida'
                  : 'Plataforma activa'}
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', marginTop: 2 }}>
              <Button
                variant="contained"
                onClick={handleCambiarEstadoPlataforma}
                disabled={sesion.datos.rol != RolesBilleteras.propietario}
                sx={{ marginLeft: 'auto' }}
              >
                {plataforma.datos.estado == Estados.suspendido
                  ? 'Activar'
                  : 'Suspender'}
              </Button>
            </Box>
          </InfoCard>
        </Grid>

        <Grid item xs={6}>
          <InfoCard
            header="Monto Minimo de intercambio"
            loading={plataforma.cargando}
            sx={{ height: '100%' }}
          >
            <Alert severity="info" elevation={1}>
              <Typography
                variant="body1"
                color="initial"
                sx={{ fontWeight: 'medium' }}
              >
                {`Monto mínimo actual: ${plataforma.datos.montoMinimo}`}
              </Typography>
            </Alert>

            <Divider sx={{ marginY: 2 }} />

            <Box sx={{ ...FlexBoxSpaceBetween }}>
              <TextField
                id="txt-busqueda"
                label={'Nuevo Monto Minimo'}
                value={montoMinimo}
                variant="outlined"
                onChange={handleCambiarMontoMinimoText}
                sx={{ flexGrow: 1, marginRight: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                disabled={!montoMinimo}
                onClick={handleCambiarMontoMinimoButton}
              >
                Cambiar Monto
              </Button>
            </Box>
          </InfoCard>
        </Grid>
      </Grid>
    </>
  )
}
