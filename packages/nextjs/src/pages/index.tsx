import CrearOrdenes from '@/components/CrearOrdenes'
import ListarOrdenes from '@/components/ListarOrdenes'
import BaseLayout from '@/components/layout/BaseLayout'
import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Grid } from '@mui/material'
import Head from 'next/head'
import { useEffect } from 'react'

export default function Home() {
  const { actions } = useBlockchainContext()
  const { cargarTokens } = actions

  useEffect(() => {
    cargarTokens(false)
  }, [cargarTokens])

  return (
    <BaseLayout>
      <Head>
        <title>RoyalSwap | Inicio</title>
      </Head>

      <Grid container spacing={2} height={'100%'}>
        <Grid item xs={8}>
          <ListarOrdenes />
        </Grid>
        <Grid item xs={4}>
          <CrearOrdenes />
        </Grid>
      </Grid>
    </BaseLayout>
  )
}
