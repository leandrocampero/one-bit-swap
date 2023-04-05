import dotenv from 'dotenv'
import hre from 'hardhat'
import { sleep } from '../utils/helpers'
import tokens from './deployed/tokens.json'

dotenv.config()
const { OWNER_PUBLIC_KEY } = process.env

export async function main() {
  for (const token of tokens) {
    try {
      console.log(`Verificando contrato de ${token.ticker}`)
      await hre.run('verify:verify', {
        address: token.contrato,
        constructorArguments: [
          `${token.ticker} Token Mock`,
          token.ticker,
          OWNER_PUBLIC_KEY!,
          hre.ethers.utils.parseEther('1000').toString(),
        ],
        contract: 'contracts/ERC20Mock.sol:ERC20Mock',
      })
      await sleep()
    } catch (error: any) {
      console.log(`Error al verificar el contrato ${token.ticker}`)
      console.log(error)
    }
    console.log(`Verificación terminada`)
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
