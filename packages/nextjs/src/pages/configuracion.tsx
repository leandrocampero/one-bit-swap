import { ContainerBox } from '@/components/common/styles'
import BaseLayout from '@/components/layout/BaseLayout'
import VistaAdministrador from '@/components/VistaAdministrador'
import { Box } from '@mui/material'
import Head from 'next/head'

export default function configuracion() {
  return (
    <BaseLayout>
      <Head>
        <title>P2PSwap | Configuración</title>
      </Head>

      <Box
        sx={{
          ...ContainerBox,
          padding: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <VistaAdministrador />
      </Box>
    </BaseLayout>
  )
}
