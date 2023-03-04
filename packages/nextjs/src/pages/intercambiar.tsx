import BaseLayout from '@/components/layout/BaseLayout'
import { useWallet } from '@/hooks/wallet'
import { Divider } from '@mui/material'
import Typography from '@mui/material/Typography'

export default function Intercambiar() {
  const { accounts, signer } = useWallet()

  return (
    <>
      <BaseLayout>
        <Typography variant="h1" color="initial">
          Sesion
        </Typography>
        <Divider />
        <Typography variant="h6" color="initial">
          {`Address: ${accounts[0]}`}
        </Typography>
        <Typography variant="h6" color="initial">
          {`Signer: ${signer?._isSigner}`}
        </Typography>
      </BaseLayout>
    </>
  )
}
