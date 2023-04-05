import dotenv from 'dotenv'
import { writeFileSync } from 'fs'
import { ethers } from 'hardhat'
import prettier from 'prettier'
import 'typechain'
import { ERC20Mock, ERC20Mock__factory } from '../typechain-types'
import { sleep } from '../utils/helpers'
dotenv.config()

const { OWNER_PUBLIC_KEY } = process.env
type TokenData = {
  ticker: string
  contrato: string
  decimales: number
}

async function main() {
  const TOKENS_NAMES = ['USDT', 'LINK', 'MATIC', 'WETH', 'DAI', 'SAND']
  const tokensDeployedContracts: {
    [key: string]: ERC20Mock
  } = {}
  const tokensData: TokenData[] = []

  const ERC20Factory = (await ethers.getContractFactory(
    'contracts/ERC20Mock.sol:ERC20Mock'
  )) as ERC20Mock__factory

  for (const token of TOKENS_NAMES) {
    const contract = (await ERC20Factory.deploy(
      `${token} Token Mock`, // Nombre falso para el token
      token, // Simbolo
      OWNER_PUBLIC_KEY!, // Clave pública (propietario) para emitir tokens iniciales
      ethers.utils.parseEther('1000') // Cantidad de tokens a emitir
    )) as ERC20Mock

    await contract.deployed()

    const address = contract.address
    const symbol = await contract.symbol()
    const decimals = await contract.decimals()

    tokensDeployedContracts[token] = contract
    tokensData.push({ contrato: address, ticker: symbol, decimales: decimals })

    console.log(`Faucet de ${token} desplegado en ${contract.address}`)
    await sleep()
  }

  const faucetsFormated = prettier.format(JSON.stringify(tokensData), {
    parser: 'json',
  })

  writeFileSync(
    `./../nextjs/src/contracts/tokens.json`,
    faucetsFormated,
    'utf-8'
  )

  await sleep()

  writeFileSync(`./deployed/tokens.json`, faucetsFormated, 'utf-8')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
