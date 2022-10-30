import hre from 'hardhat'

export async function main() {
  await hre.run('verify:verify', {
    address: '0xA685C22cE840C8C82717F6107571f9E64E623939',
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
