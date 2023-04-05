import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'
import 'hardhat-abi-exporter'
import { HardhatUserConfig } from 'hardhat/config'

dotenv.config()

const { OWNER_PRIVATE_KEY, POLYGON_API_KEY, ALCHEMY_API_KEY } = process.env

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'polygonMumbai',
  networks: {
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      chainId: 80001,
      accounts: [`0x${OWNER_PRIVATE_KEY}`],
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      chainId: 137,
      accounts: [`0x${OWNER_PRIVATE_KEY}`],
    },
    hardhat: {
      forking: {
        url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        //blockNumber: 29234537,
      },
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      allowUnlimitedContractSize: true,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: `${POLYGON_API_KEY}`,
    },
  },
  paths: {
    tests: './test',
  },
  abiExporter: {
    path: './../nextjs/src/contracts/',
    runOnCompile: true,
    clear: true,
    only: [':Plataforma$', ':ERC20$', ':ERC20Mock'],
    format: 'json',
  },
}

export default config
