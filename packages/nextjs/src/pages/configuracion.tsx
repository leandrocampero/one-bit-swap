import { ContainerBox } from '@/components/common/styles'
import BaseLayout from '@/components/layout/BaseLayout'
import VistaAdminsitrador from '@/components/VistaAdminsitrador'
import { Box } from '@mui/material'

export default function configuracion() {
  return (
    <BaseLayout>
      <Box sx={{ ...ContainerBox, padding: 0, height: '100%' }}>
        <VistaAdminsitrador />
      </Box>
    </BaseLayout>
  )
}
