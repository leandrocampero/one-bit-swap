import hre from 'hardhat'

export async function main() {
  await hre.run('verify:verify', {
    address: '0x94aD8E3501Bc56dDdeA3cd5558B31FDd3885192A',
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
