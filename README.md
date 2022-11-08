# OneBitSwap

Monorepo del proyecto de graduación titulado "Plataforma Decentralizada para Intercambio de Criptomonedas" para acceder al título de Ingenieros en Computación.

## Objetivos y alcances del proyecto

El objetivo principal es desarrollar una plataforma web descentralizada para el intercambio de criptomonedas, que permita al usuario final conectarse a la misma con su wallet preferida y realizar órdenes de intercambio de criptomonedas a las cuales cualquier otro usuario pueda responder.
La futura plataforma llevará el nombre de **_OneBitSwap_**, y debe ser desarrollada usando únicamente tecnologías web 3.0.

## Implementación

| Aspecto de implementación           | Tecnología                                                            |
| ----------------------------------- | --------------------------------------------------------------------- |
| Billetera digital                   | [Metamask](https://docs.metamask.io/guide/)                           |
| Interfaz de usuario (Aplicación)    | [Next.js](https://nextjs.org/docs)                                    |
| Lenguaje de desarrollo (Aplicación) | [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html) |
| Cliente Ethereum                    | [Ethers.js](https://docs.ethers.io/v5/)                               |
| Entorno de desarrollo (Contratos)   | [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started)    |
| Lenguaje de desarrollo (Contratos)  | [Solidity](https://docs.soliditylang.org/en/v0.8.17/)                 |
| Blockchain                          | [Harmony](https://docs.harmony.one/home/developers/getting-started)   |
| Oráculo                             | [Chainlink](https://chain.link/)                                      |
| Servidor Web                        | [fleek](https://docs.fleek.co/)                                       |
| Almacenamiento de archivos          | [IPFS](https://ipfs.tech/#install)                                    |
| Entorno de desarrollo (IDE)         | [VSCode](https://code.visualstudio.com/)                              |
| Repositorio colaborativo de código  | [Github](https://github.com/)                                         |

## Contrato de Plataforma

Algunas tareas básicas:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

---

### Iteraciones

#### Mumbai

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
yarn create next-app --typescript
yarn eslint

yarn add --dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-import-resolver-typescript
yarn add --dev prettier eslint-config-prettier eslint-plugin-prettier
yarn add --dev husky

yarn run hardhat
# Crear nuevo proyecto con Typescript, agregar gitignore
# No instalar los paquetes que ofrece porque lo hace con npm
# Se lo hace manual con yarn a continuación
yarn add --dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers @types/mocha mocha ts-node hardhat

yarn add dotenv # para ejecutar variables de entorno

yarn add @openzeppelin/contracts @chainlink/contracts # para utilzar las interfaces de contratos de token ERC20 y el oraculo
```
