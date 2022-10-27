import { ethers } from 'hardhat'
import 'typechain'
import { verify } from './verify'

async function main() {
  const args = 5
  const Plataforma = await ethers.getContractFactory('Plataforma')
  const despliegue = await Plataforma.deploy(args)

  await despliegue.deployed()

  console.log(`Contrato de plataforma desplegado en ${despliegue.address}`)
  console.log('Recibo: ', despliegue)

  await verify(despliegue.address, [args])
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
