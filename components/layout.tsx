import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'

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
    >
      <h1>OneBitSwap</h1>
    </Box>
  )
}
