import hre from 'hardhat'

export async function main() {
  await hre.run('verify:verify', {
    address: '0x89F32f0CFA18abf8C5a888829EE7ebaf103c927a',
    constructorArguments: [5],
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
