import { writeFileSync } from 'fs'
import { ethers } from 'hardhat'
import 'typechain'

async function main() {
  const args = 5
  const PlataformaFactory = await ethers.getContractFactory(
    'contracts/Plataforma.sol:Plataforma'
  )
  const plataforma = await PlataformaFactory.deploy(args)

  await plataforma.deployed()

  console.log(`Contrato de plataforma desplegado en ${plataforma.address}`)

  const deploy = {
    platform: plataforma.address,
  }
  writeFileSync(
    `./../nextjs/src/contracts/deploy.json`,
    JSON.stringify(deploy),
    'utf-8'
  )
  writeFileSync(`./deployed/platform.json`, JSON.stringify(deploy), 'utf-8')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
