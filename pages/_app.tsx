import Navbar from '@components/navbar'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
