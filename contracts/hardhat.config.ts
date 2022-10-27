import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'

dotenv.config()

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
      url: 'https://rpc-mumbai.matic.today',
      chainId: 80001,
      accounts: [`${process.env.TESTNET_PRIVATE_KEY}`],
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      chainId: 137,
      accounts: [`${process.env.MAINNET_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGON_API_KEY,
  },
}

export default config
