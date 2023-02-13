import CrearOrden from '@/components/Ordenes/crearOrden'
import ListaOrdenes from '@/components/listaOrdenes'
import ListarOrdenesTest from '@/components/ListarOrdenesTest'
import CrearOrdenesTest from '@/components/CrearOrdenesTest'
import styles from '@/styles/layout.module.scss'
import { Box, Grid } from '@mui/material'
import { grey } from '@mui/material/colors'

const sxProps = {
  mx: 2,
  my: 5,
  p: 5,
  borderRadius: 2,
  backgroundColor: grey[400],
}

export default function Home() {
  return (
    <Grid container>
      <Grid item xs={8}>
        <Box sx={sxProps} className={styles.base}>
          <h1>Ordenes Abiertas y demas</h1>
          <ListarOrdenesTest />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={sxProps} className={styles.base}>
          <h1>Ordenes compra/Venta e intercambio</h1>
          <CrearOrdenesTest />
        </Box>
      </Grid>
    </Grid>
  )
}
