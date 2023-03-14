import {
  AppBar,
  Box,
  Container,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import ConectarWallet from './ConectarWallet'

export default function Navbar() {
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
              <Grid item>
                <ConectarWallet />
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </Box>
    </AppBar>
  )
}
