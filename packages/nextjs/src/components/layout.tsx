import styles from '@/styles/layout.module.scss'
import { Avatar, Box, TextField } from '@mui/material'
import { grey } from '@mui/material/colors'
import Link from 'next/link'
import React from 'react'

export default function Layout() {
  const [text, setText] = React.useState(
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, libero!'
  )
  const changeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tex = event.target.value
    setText(tex)
  }
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
      <TextField id="test" label="" value={text} onChange={changeText} />
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
