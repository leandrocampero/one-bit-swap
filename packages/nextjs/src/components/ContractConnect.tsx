import BlockchainAdapter from '@/lib/BlockchainAdapter'
import Button from '@mui/material/Button'
import { Datos } from '@one-bit-swap/hardhat/typechain-types/'
import { useState } from 'react'

export default function ContractConnect() {
  const [resultado, setResultado] = useState<Datos.TokenStruct[]>([])

  const config = async () => {
    const adapter = BlockchainAdapter.instanciar()

    adapter.iniciar()

    setResultado(await adapter.tokens(true))
  }

  return (
    <>
      <Button color="primary" variant="contained" onClick={config}>
        Listar tokens
      </Button>
      <br />
      {resultado.map((token: Datos.TokenStruct) => (
        <div key={token.ticker as string}>{token.ticker as string}</div>
      ))}
    </>
  )
}
