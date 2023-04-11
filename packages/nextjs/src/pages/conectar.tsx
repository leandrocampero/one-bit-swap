import BaseLayout from '@/components/layout/BaseLayout'
import { useSessionContext } from '@/context/SessionProvider'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  SxProps,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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
  const { connect, changeNetwork, loading, connected, switchNetwork } =
    useSessionContext()
  const router = useRouter()

  useEffect(() => {
    if (connected && !loading) {
      router.push('/')
    }
  }, [connected, loading, router])

  return (
    <BaseLayout style={FlexBox}>
      <Card elevation={5} sx={ActionBox}>
        <CardHeader title="P2PSwap" subheader="Conectar billetera para usar" />
        <Divider />
        <CardContent>
          {switchNetwork ? (
            <Button
              key={'network'}
              variant="contained"
              color="primary"
              size="large"
              sx={{ width: '100%' }}
              onClick={changeNetwork}
            >
              Cambiar de red
            </Button>
          ) : (
            <Button
              key={'connect'}
              variant="contained"
              color="success"
              size="large"
              sx={{ width: '100%' }}
              onClick={connect}
            >
              Conectar Metamask
            </Button>
          )}
        </CardContent>
      </Card>
    </BaseLayout>
  )
}
