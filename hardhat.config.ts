import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'

dotenv.config()

const { TESTNET_PRIVATE_KEY, MAINNET_PRIVATE_KEY, POLYGON_API_KEY } =
  process.env

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
      accounts: [`0x${TESTNET_PRIVATE_KEY}`],
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      chainId: 137,
      accounts: [`0x${MAINNET_PRIVATE_KEY}`],
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
