import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'

dotenv.config()

const {
  TESTNET_PRIVATE_KEY,
  MAINNET_PRIVATE_KEY,
  POLYGON_API_KEY,
  ALCHEMY_API_KEY,
} = process.env

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  defaultNetwork: 'polygonMumbai',
  networks: {
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      chainId: 80001,
      accounts: [`0x${TESTNET_PRIVATE_KEY}`],
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      chainId: 137,
      accounts: [`0x${MAINNET_PRIVATE_KEY}`],
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
    apiKey: `${POLYGON_API_KEY}`,
  },
  paths: {
    tests: './contracts/test',
  },
}

export default config
