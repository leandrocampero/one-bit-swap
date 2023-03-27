import { useBlockchainContext } from '@/context/BlockchainProvider'
import { useSessionContext } from '@/context/SessionProvider'
import { RolesBilleteras } from '@/types.d'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material'
import Link from 'next/link'

export default function Navbar() {
  const { disconnect, connected } = useSessionContext()
  const { getters } = useBlockchainContext()
  const { sesion } = getters

  return (
    <AppBar position="fixed">
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar>
          <Container maxWidth="lg">
            <Grid
              container
              direction={'row'}
              justifyContent="space-between"
              alignItems={'center'}
            >
              <Grid item>
                <Typography variant="h4" noWrap>
                  <Link href="/">OneBitSwap</Link>
                </Typography>
              </Grid>

              {sesion.datos.rol == RolesBilleteras.administrador ? (
                <Grid item sx={{ marginLeft: 'auto' }}>
                  <Button
                    id="demo-customized-button"
                    variant="contained"
                    disableElevation
                    startIcon={<SettingsIcon />}
                  >
                    <Link href="/configuracion">Configuracion</Link>
                  </Button>
                </Grid>
              ) : null}

              {connected && (
                <Grid item>
                  <Button variant="contained" color="info" onClick={disconnect}>
                    Desconectar
                  </Button>
                </Grid>
              )}
            </Grid>
          </Container>
        </Toolbar>
      </Box>
    </AppBar>
  )
}
