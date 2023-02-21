const hre = require('hardhat')

async function main() {
    const KaKaoERC1155 = await hre.ethers.getContractFactory('KaKaoERC1155')
    const kaKaoERC1155 = await KaKaoERC1155.deploy('https://ipfs.savvycom/')
    await kaKaoERC1155.deployed()
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
