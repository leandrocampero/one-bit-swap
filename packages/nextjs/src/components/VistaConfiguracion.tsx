import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Estados } from '@/types.d'
import { Button, Grid, InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

export default function VistaConfiguracion() {
  const { getters, actions } = useBlockchainContext()
  const { plataforma } = getters
  const {
    bloquearPlataforma,
    desbloquearPlataforma,
    cambiarMontoMinimoPlataforma,
  } = actions

  const [montoMinimo, setMontoMinimo] = useState<string>('')

  const handleCambiarMontoMinimoText = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMontoMinimo(evt.target.value.trim())
  }

  const handleCambiarMontoMinimoButton = () => {
    cambiarMontoMinimoPlataforma(montoMinimo)
  }

  const handleCambiarEstadoPlataforma = () => {
    if (plataforma.datos?.estado == Estados.activo) {
      desbloquearPlataforma()
    } else {
      bloquearPlataforma()
    }
  }

  useEffect(() => {
    console.log('MontoMinimo: ' + plataforma.datos.montoMinimo)
  }, [plataforma])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={5} md={10}>
          <h4>Monto Minimo Actual: ${plataforma.datos.montoMinimo}</h4>
        </Grid>
        <Grid item xs={5} md={5}>
          <TextField
            id="txt-busqueda"
            label={'Nuevo Monto Minimo'}
            value={montoMinimo}
            variant="outlined"
            onChange={handleCambiarMontoMinimoText}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={5} md={5}>
          <Button variant="contained" onClick={handleCambiarMontoMinimoButton}>
            Cambiar Monto
          </Button>
        </Grid>
        <Grid item xs={5} md={5}>
          <h3>
            {'Estado Actual de la Plataforma: ' +
              (plataforma.datos?.estado == Estados.suspendido
                ? 'Suspendida'
                : 'Activa')}
          </h3>
        </Grid>
        <Grid item xs={5} md={5}>
          <Button variant="contained" onClick={handleCambiarEstadoPlataforma}>
            {(plataforma.datos?.estado == Estados.suspendido
              ? 'Suspender'
              : 'Activar') + ' Plataforma'}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
