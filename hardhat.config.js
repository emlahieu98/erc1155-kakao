require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('@openzeppelin/hardhat-upgrades')

const dotenv = require('dotenv')
dotenv.config()
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
    const accounts = await ethers.getSigners()

    console.log('process.env.KOVAN_URL ', process.env.KOVAN_URL)
    for (const account of accounts) {
        console.log(account.address)
    }
})

module.exports = {
    defaultNetwork: 'localhost',
    networks: {
        localhost: {
            url: 'http://127.0.0.1:8545',
        },
        hardhat: {},
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
            bscTestnet: process.env.BSCSCAN_API_KEY,
        },
    },
    solidity: {
        version: '0.8.4',
        settings: {
            optimizer: {
                enabled: true,
            },
        },
    },
    paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
    mocha: {
        timeout: 20000,
    },
}
