import { Avatar, Box, TextField } from '@mui/material'
import { grey } from '@mui/material/colors'
import styles from '@styles/layout.module.scss'
import Link from 'next/link'

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
      <Link href={'/'}>
        <Avatar
          alt="Kirby"
          src="https://static.wikia.nocookie.net/kirby/images/0/09/Kirby_Kirby%27s_Dream_Buffet.png"
          sx={{ width: 56, height: 56 }}
        />
      </Link>
      <h1> Steban GIL</h1>
    </Box>
  )
}
