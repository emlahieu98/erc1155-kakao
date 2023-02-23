require('@nomicfoundation/hardhat-toolbox')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    networks: {
        // defaultNetwork: 'hardhat',
        // localhost: {
        //     url: 'http://127.0.0.1:8545',
        // },
        // hardhat: {},
        bscTestnet: {
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
            chainId: 97,
            gasPrice: 20000000000,
            accounts: [process.env.OWNER_PRIVATE_KEY],
        },
        mainnet: {
            url: 'https://bsc-dataseed.binance.org/',
            chainId: 56,
            gasPrice: 20000000000,
            accounts: { mnemonic: process.env.OWNER_PRIVATE_KEY },
        },
    },
    etherscan: {
        apiKey: {
            bscTestnet: process.env.BSC_SCAN_API_KEY,
        },
    },
    solidity: {
        version: '0.8.9',
        settings: {
            optimizer: {
                enabled: true,
            },
        },
    },
}
