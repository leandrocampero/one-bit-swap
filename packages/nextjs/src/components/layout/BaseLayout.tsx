import { useSessionContext } from '@/context/SessionProvider'
import {
  Backdrop,
  Box,
  CircularProgress,
  LinearProgress,
  SxProps,
} from '@mui/material'
import { useRouter } from 'next/router'

export default function BaseLayout({
  children,
  style,
  loading,
}: {
  children: React.ReactElement | React.ReactElement[]
  style?: SxProps
  loading?: boolean
}) {
  const { loading: recuperandoSesion } = useSessionContext()
  const router = useRouter()
  const paginaConectar = router.pathname.startsWith('/')

  return (
    <Box
      paddingTop={12}
      paddingBottom={4}
      paddingX={4}
      height={'100vh'}
      sx={style}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading !== undefined ? loading : recuperandoSesion}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {recuperandoSesion && !paginaConectar ? <LinearProgress /> : children}
    </Box>
  )
}
