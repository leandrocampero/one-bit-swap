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
  networks: {
    testnet: {
      chainId: 1666700000,
      url: `https://api.s0.b.hmny.io`,
      accounts: [`0x${process.env.TESTNET_PRIVATE_KEY}`],
    },
    mainnet: {
      chainId: 1666600000,
      url: `https://api.harmony.one`,
      accounts: [`0x${process.env.MAINNET_PRIVATE_KEY}`],
    },
  },
}

export default config
