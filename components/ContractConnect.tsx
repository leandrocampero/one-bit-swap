import Button from '@mui/material/Button'
import { ethers } from 'ethers'
import { useState } from 'react'
import Plataforma from '../artifacts/contracts/Plataforma.sol/Plataforma.json'
import {
  Datos,
  Plataforma as PlataformaInterface,
} from '../typechain-types/contracts/Plataforma'

export default function ContractConnect() {
  const [resultado, setResultado] = useState<Datos.TokenStruct[]>([])

  const config = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')

    provider.provider.request!({ method: 'eth_requestAccounts' })

    const signer = await provider.getSigner()
    const contract = new ethers.Contract(
      '0xA3e6Fbe2707A7217Be8B4876979E77754FE88259',
      Plataforma.abi,
      signer
    ) as PlataformaInterface

    const result = (await contract.listarTokens(true)) as Datos.TokenStruct[]

    console.log(result)
    setResultado(result)
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
