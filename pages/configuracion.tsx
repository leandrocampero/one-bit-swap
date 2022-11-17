import { Box, Grid } from '@mui/material'
import { grey } from '@mui/material/colors'
import styles from '@styles/layout.module.scss'

const sxProps = {
  mx: 2,
  my: 5,
  p: 5,
  borderRadius: 2,
  backgroundColor: grey[400],
}

export default function configuracion() {
  return (
    <Grid container>
      <Grid item xs={2}>
        <Box sx={sxProps} className={styles.base}>
          {/* <Componente del gsus> */}
          <h1>Gestionar ...</h1>
        </Box>
      </Grid>
      <Grid item xs={10}>
        <Box sx={sxProps} className={styles.base}>
          <h1>Tablita</h1>
        </Box>
      </Grid>
    </Grid>
  )
}
