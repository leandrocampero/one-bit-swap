import hre from 'hardhat'

export async function main() {
  await hre.run('verify:verify', {
    address: '0xA3e6Fbe2707A7217Be8B4876979E77754FE88259',
    constructorArguments: [5],
    contract: 'contracts/Plataforma.sol:Plataforma',
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
