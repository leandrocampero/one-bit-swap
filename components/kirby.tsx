import { Avatar } from '@mui/material'
import Link from 'next/link'

export interface Imagenes {
  enlace: string
  size: number
}

/*
const imagenes: Imagenes = {
    enlace:
      'https://static.wikia.nocookie.net/kirby/images/0/09/Kirby_Kirby%27s_Dream_Buffet.png/',
    size: 250,
  }

<Kirby enlace={imagenes.enlace} size={imagenes.size} /> */

export default function kirby(props: Imagenes) {
  return (
    <Link href={'/'}>
      <Avatar
        alt="Kirby"
        src={props.enlace}
        sx={{ width: props.size, height: props.size }}
      />
    </Link>
  )
}
