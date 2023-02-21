import { Estados } from '@/types.d'
import { Button, Grid, InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

export default function VistaConfiguracion() {
  const [getMontoMinimo, setMontoMinimo] = useState<number>(5)
  const [getEstadoActual, setEstadoActual] = useState<Estados>(Estados.activo)

  const handleClicMontoMinimo = () => {
    console.log('montoCambiado')
  }

  useEffect(() => {}, [])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={5} md={5}>
          <TextField
            id="txt-busqueda"
            label={'Monto Minimo Actual'}
            value={getMontoMinimo}
            variant="outlined"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              setMontoMinimo(parseInt(evt.target.value))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={5} md={5}>
          <Button variant="contained" onClick={handleClicMontoMinimo}>
            Cambiar Monto
          </Button>
        </Grid>
        <Grid item xs={5} md={5}>
          <h3>
            {'Estado Actual de la Plataforma: ' +
              (getEstadoActual ? 'Suspendida' : 'Activa')}
          </h3>
        </Grid>
        <Grid item xs={5} md={5}>
          <Button variant="contained" onClick={handleClicMontoMinimo}>
            {(getEstadoActual ? 'Suspender' : 'Activar') + ' Plataforma'}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
