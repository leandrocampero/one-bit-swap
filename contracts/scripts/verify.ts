import hre from 'hardhat'

export async function main() {
  await hre.run('verify:verify', {
    address: '0xF0664a4A96015Db785699e55687fE2262E590BC3',
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
