import hre from 'hardhat'

// Define the NFT
export async function verify(address: string, args: any[]) {
  console.log('Verificando contrato...')
  await hre.run('verify:verify', {
    address: address,
    constructorArguments: args,
  })
  console.log('Verificación exitosa')
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })
