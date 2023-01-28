# OneBitSwap

Monorepo del proyecto de graduación titulado "Plataforma Descentralizada para Intercambio de Criptomonedas" para acceder al título de Ingenieros en Computación. El proyecto consiste en desarrollar una Plataforma web descentralizada que permita el intercambio de criptomonedas entre pares, de manera transparente y anónima. Donde los usuarios puedan conectarse con su billetera virtual y crear una orden de compra/venta de criptomonedas.

## Objetivos y alcances del proyecto

- Aplicar conocimientos de Ingeniería de Software para el análisis , planificación y desarrollo de una aplicación web.
- Aprender acerca del proceso de desarrollo y despliegue de aplicaciones sobre la Web 3.0.
- Diseñar e implementar una plataforma que permita intercambiar criptomonedas de manera simple, rápida, transparente y anónima entre usuarios.
- Aplicar tecnologías y marcos de trabajos de la Web 3.0, la cual se constituye como una serie de herramientas descentralizadas que permiten encarar de otra forma el flujo de información y de herramientas online a través de sistemas de validación de identidad y propiedad típicos de las blockchains.

## Implementación

| Parte del sistema                   | Tecnología a utilizar                                                 |
| ----------------------------------- | --------------------------------------------------------------------- |
| Billetera digital                   | [Metamask](https://docs.metamask.io/guide/)                           |
| Interfaz de usuario (Aplicación)    | [Next.js](https://nextjs.org/docs)                                    |
| Lenguaje de desarrollo (Aplicación) | [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html) |
| Cliente de blockchain               | [Ethers.js](https://docs.ethers.io/v5/)                               |
| Entorno de desarrollo (Contratos)   | [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started)    |
| Lenguaje de desarrollo (Contratos)  | [Solidity](https://docs.soliditylang.org/en/v0.8.17/)                 |
| Blockchain para despliegue          | [Polygon](https://wiki.polygon.technology/)                           |
| Proveedor de nodos                  | [Alchemy](https://docs.alchemy.com/reference/api-overview)            |
| Oráculo                             | [Chainlink](https://chain.link/)                                      |
| Servidor Web                        | [fleek](https://docs.fleek.co/)                                       |
| Almacenamiento de archivos          | [IPFS](https://ipfs.tech/#install)                                    |
| Entorno de desarrollo (IDE)         | [VSCode](https://code.visualstudio.com/)                              |
| Repositorio colaborativo de código  | [Github](https://github.com/)                                         |

## Comandos básicos

```bash
# Ejecutar tareas por paquete
yarn workspace @one-bit-swap/<paquete> <tarea|comando>

# Comandos predefinidos
yarn clean # limpiar archivos generados por hardhat para el deploy
yarn chain # montar nodo local para pruebas
yarn compile # compilar contratos
yarn deploy # desplegar contrato (previamente compilado) en el nodo local (temporalmente)
yarn deploy-fill # desplegar contrato ya poblado para pruebas del cliente
yarn dev # ejecutar aplicación del cliente en modo desarrollo
yarn build # construir aplicación para despliegue
yarn start # iniciar aplicación ya construida
yarn test:contracts # correr pruebas de contratos (tiene que correr el nodo local de hardhat)
yarn test:client # correr pruebas de cliente (temporalmente deshabilidado)
```

---

## Archivo de variables de entorno

```properties
# Clave privada del propietario del contrato y plataforma
OWNER_PRIVATE_KEY=privateKey

# ApiKey de polygonscan para verificar contratos
POLYGON_API_KEY=privateKey

# ApiKey de Alchemy para usar el RPC propio
ALCHEMY_API_KEY=apikey
```

---

## Scripts utilizados

La siguiente sección muestra los comandos utilizados paso a paso para crear la aplicación

```bash
mkdir one-bit-swap && cd one-bit-swap
git init
mkdir packages
mkdir packages/hardhat
mkdir packages/nextjs

# Hardhat (dentro del directorio)
yarn init
yarn add --dev hardhat dotenv hardhat-abi-exporter
yarn hardhat # continuar los pasos para configurar un proyecto con typescript
yarn add @openzeppelin/contracts @chainlink/contracts # agregar las librerias para tokens ERC20 y oraculos

# Nextjs (dentro de packages/)
yarn create next-app --typescript nextjs
cd nextjs
yarn add @mui/material @emotion/react @emotion/styled @mui/icons-material

# Monorepo root
touch package.json # archivo de configuracion para monorepo, tomando los espacios de trabajo dentro de packages
yarn add --dev --ignore-workspace-root-check
  @typescript-eslint/parser
  @typescript-eslint/eslint-plugin
  eslint-import-resolver-typescript
  prettier
  eslint-config-prettier
  eslint-plugin-prettier
yarn install
```
