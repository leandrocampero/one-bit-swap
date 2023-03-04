import BaseLayout from '@/components/layout/BaseLayout'
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

export default function Home() {
  const router = useRouter()
  const { connect, getAccounts, signer } = useWallet()

  const handleConnect = useCallback(async () => {
    await connect()
    await getAccounts()
  }, [connect, getAccounts])

  useEffect(() => {
    !!signer && router.push('/intercambiar')
  }, [signer, router])

  return (
    <>
      <BaseLayout style={FlexBox}>
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
    </>
  )
}
