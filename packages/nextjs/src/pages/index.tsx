import CrearOrdenes from '@/components/CrearOrdenes'
import ListarOrdenes from '@/components/ListarOrdenes'
import { ContainerBox } from '@/components/common/styles'
import BaseLayout from '@/components/layout/BaseLayout'
import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Box, Grid } from '@mui/material'
import { useEffect } from 'react'

export default function Home() {
  const { actions } = useBlockchainContext()
  const { cargarTokens } = actions

  useEffect(() => {
    cargarTokens(false)
  }, [cargarTokens])

  return (
    <BaseLayout>
      <Grid container spacing={2} height={'100%'}>
        <Grid item xs={8}>
          <ListarOrdenes />
        </Grid>
        <Grid item xs={4}>
          <Box sx={ContainerBox}>
            <h1>Ordenes compra/Venta e intercambio</h1>
            <CrearOrdenes />
          </Box>
        </Grid>
      </Grid>
    </BaseLayout>
  )
}
