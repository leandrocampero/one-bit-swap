import { ethers } from 'hardhat'

async function main() {
  const Plataforma = await ethers.getContractFactory(
    'contracts/Plataforma.sol:Plataforma'
  )
  const despliegue = await Plataforma.deploy()

  await despliegue.deployed()

  console.log(`Contrato de plataforma desplegado en ${despliegue.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
