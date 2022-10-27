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

## Scripts utilizados

```bash
cd contracts/
yarn init # Copiar los datos del archivo package.json
cd ..
yarn workspace contracts run hardhat
# Crear nuevo proyecto con Typescript, agregar gitignore
# No instalar los paquetes que ofrece porque lo hace con npm
# Se lo hace manual con yarn a continuación
yarn workspace contracts add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers @types/mocha mocha ts-node hardhat
yarn workspace contracts add dotenv # para ejecutar variables de entorno
```
