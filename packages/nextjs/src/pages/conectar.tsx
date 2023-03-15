import BaseLayout from '@/components/layout/BaseLayout'
import { useBlockchainContext } from '@/context/BlockchainProvider'
import { useWallet } from '@/hooks/wallet'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  SxProps,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

const FlexBox = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const ActionBox: SxProps = {
  maxWidth: '500px',
  width: '100%',
}

export default function Conectar() {
  const router = useRouter()
  const { connect } = useWallet()
  const { actions, state } = useBlockchainContext()
  const { cargarDatosPlataforma } = actions
  const { sesion } = state

  const handleConnect = useCallback(async () => {
    await connect()
  }, [connect])

  useEffect(() => {
    if (!sesion.cargando && sesion.datos.direccion !== '') {
      cargarDatosPlataforma()
      router.push('/')
    }
  }, [sesion, router, cargarDatosPlataforma])

  return (
    <BaseLayout style={FlexBox} loading={sesion.cargando}>
      <Card elevation={5} sx={ActionBox}>
        <CardHeader
          title="OneBitSwap"
          subheader="Conectar billetera para usar"
        />
        <Divider />
        <CardContent>
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ width: '100%' }}
            onClick={handleConnect}
          >
            Conectar Metamask
          </Button>
        </CardContent>
      </Card>
    </BaseLayout>
  )
}
