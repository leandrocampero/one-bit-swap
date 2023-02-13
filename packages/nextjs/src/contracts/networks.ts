const networks = {
  development: {
    chainId: `0x${Number(31337).toString(16)}`,
    rpcUrls: [`http://127.0.0.1:8545/`],
    chainName: 'Hardhat Network (Mumbai Local Fork)',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'Matic token',
      decimals: 18,
    },
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
  production: {
    chainId: `0x${Number(80001).toString(16)}`,
    rpcUrls: [
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    ],
    chainName: 'Matic Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'Matic token',
      decimals: 18,
    },
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
}

export default networks
