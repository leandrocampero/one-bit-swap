import { Box, TextField } from '@mui/material'
import { grey } from '@mui/material/colors'
import styles from '@styles/layout.module.scss'

const text =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, libero!'

export default function Layout() {
  return (
    <Box
      sx={{
        width: '80%',
        mx: 'auto',
        my: 5,
        p: 5,
        borderRadius: 2,
        backgroundColor: grey[400],
      }}
      className={styles.base}
    >
      <h1>OneBitSwap</h1>
      <TextField id="test" label="" value={text} />
    </Box>
  )
}
