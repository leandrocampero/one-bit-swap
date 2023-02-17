import CrearOrden from '@/components/Ordenes/crearOrden'
import VistaOrdenes from '@/components/VistaOrdenes'
import BaseLayout from '@/components/layout/BaseLayout'
import { useBlockchainContext } from '@/context/BlockchainProvider'
import styles from '@/styles/layout.module.scss'
import { Box, Grid } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const sxProps = {
  p: 5,
  borderRadius: 2,
  backgroundColor: grey[400],
}

export default function Intercambiar() {
  const router = useRouter()
  const { state, actions } = useBlockchainContext()
  const { sesion } = state
  const { cargarTokens } = actions

  useEffect(() => {
    if (!sesion.cargando && sesion.datos.direccion === '') {
      router.push('/')
    }
  }, [sesion, router])

  useEffect(() => {
    cargarTokens(false)
  }, [cargarTokens])

  return (
    <BaseLayout loading={sesion.cargando}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box sx={sxProps} className={styles.base}>
            <h1>Ordenes Abiertas y demas</h1>
            <VistaOrdenes />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={sxProps} className={styles.base}>
            <h1>Ordenes compra/Venta e intercambio</h1>
            <CrearOrden />
          </Box>
        </Grid>
      </Grid>
    </BaseLayout>
  )
}
