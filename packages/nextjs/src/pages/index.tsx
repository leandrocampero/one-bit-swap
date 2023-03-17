import CrearOrdenesTest from '@/components/CrearOrdenesTest'
import ListarOrdenesTest from '@/components/ListarOrdenesTest'
import BaseLayout from '@/components/layout/BaseLayout'
import { useBlockchainContext } from '@/context/BlockchainProvider'
import styles from '@/styles/layout.module.scss'
import { Box, Grid } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useEffect } from 'react'

const sxProps = {
  p: 5,
  borderRadius: 2,
  backgroundColor: grey[400],
}

export default function Home() {
  const { actions } = useBlockchainContext()
  const { cargarTokens } = actions

  useEffect(() => {
    cargarTokens(false)
  }, [cargarTokens])

  return (
    <BaseLayout>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box sx={sxProps} className={styles.base}>
            <h1>Ordenes Abiertas y demas</h1>
            <ListarOrdenesTest />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={sxProps} className={styles.base}>
            <h1>Ordenes compra/Venta e intercambio</h1>
            <CrearOrdenesTest />
          </Box>
        </Grid>
      </Grid>
    </BaseLayout>
  )
}
