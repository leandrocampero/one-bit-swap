import BaseLayout from '@/components/layout/BaseLayout'
import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Divider } from '@mui/material'
import Typography from '@mui/material/Typography'

export default function Intercambiar() {
  const { state } = useBlockchainContext()
  const { sesion } = state

  return (
    <BaseLayout loading={sesion.cargando}>
      <Typography variant="h1" color="initial">
        Sesion
      </Typography>
      <Divider />
      <Typography variant="h6" color="initial">
        {`Address: ${state.sesion.datos.direccion}`}
      </Typography>
      <Typography variant="h6" color="initial">
        {`Estado: ${state.sesion.datos.estado === 0 ? 'Activo' : 'Suspendido'}`}
      </Typography>
    </BaseLayout>
  )
}
