import hre from 'hardhat'
import deploy from './deployed/platform.json'

export async function main() {
  console.log(`Verificando contrato de plataforma`)
  await hre.run('verify:verify', {
    address: deploy.platform,
    constructorArguments: [5],
    contract: 'contracts/Plataforma.sol:Plataforma',
  })
  console.log(`Verificación completa`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
