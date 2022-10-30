# OneBitSwap - Contrato de Plataforma

Algunas tareas básicas:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

---

## Iteraciones

### Mumbai

1. `0x89F32f0CFA18abf8C5a888829EE7ebaf103c927a` -> [Codigo](https://mumbai.polygonscan.com/address/0x89F32f0CFA18abf8C5a888829EE7ebaf103c927a#code)

---

## Archivo de variables de entorno

```conf
TESTNET_PRIVATE_KEY=privateKey
MAINNET_PRIVATE_KEY=privateKey
POLYGON_API_KEY=apikey
```

---

## Scripts utilizados

```bash
cd contracts/
yarn init # y luego copiar los datos del archivo package.json
cd ..
yarn workspace contracts run hardhat
# Crear nuevo proyecto con Typescript, agregar gitignore
# No instalar los paquetes que ofrece porque lo hace con npm
# Se lo hace manual con yarn a continuación
yarn workspace contracts add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers @types/mocha mocha ts-node hardhat

yarn workspace contracts add dotenv # para ejecutar variables de entorno

yarn workspace contracts add @openzeppelin/contracts @chainlink/contracts # para utilzar las interfaces de contratos de token ERC20 y el oraculo
```
