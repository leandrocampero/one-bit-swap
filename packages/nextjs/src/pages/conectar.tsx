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
  const { connect, loading, connected } = useSessionContext()
  const router = useRouter()

  const handleConnect = useCallback(async () => {
    await connect()
  }, [connect])

  useEffect(() => {
    if (connected && !loading) {
      router.push('/')
    }
    console.log('router')
  }, [connected, loading, router])

  return (
    <BaseLayout style={FlexBox} loading={loading}>
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
