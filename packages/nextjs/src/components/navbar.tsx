import { useSessionContext } from '@/context/SessionProvider'
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
