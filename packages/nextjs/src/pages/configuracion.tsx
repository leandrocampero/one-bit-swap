import VistaAdminsitrador from '@/components/vistaAdminsitrador'
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

export default function configuracion() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={sxProps} className={styles.base}>
          <VistaAdminsitrador />
        </Box>
      </Grid>
    </Grid>
  )
}
