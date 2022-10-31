import hre from 'hardhat'

export async function main() {
  await hre.run('verify:verify', {
    address: '0xe3Fe647580E97f4a79535F97D15dC9f8D095B701',
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
