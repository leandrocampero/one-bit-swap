import Navbar from '@/components/navbar'
import { BlockchainProvider } from '@/context/BlockchainProvider'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <BlockchainProvider>
        <Navbar />
        <Component {...pageProps} />
      </BlockchainProvider>
    </div>
  )
}

export default MyApp
