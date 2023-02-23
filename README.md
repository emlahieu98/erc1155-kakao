# Kakao Project

#RUN

-   require : install nodejs version 18
-   branch : master

1. Copy file .env.example -> .env
   cp .env.example .env

2. Compile

npx hardhat compile

3. Run test case

npx hardhat test

4. Deploy project BSC Testnet Chain

npx hardhat run --network bscTestnet scripts/deploy.js

5. Verify smart contract

npx hardhat verify <address> --network bscTestnet "Constructor argument 1"

6. Example

We have deployed and verified smart contract at this address
https://testnet.bscscan.com/address/0xBd7C019f4429cC52E68Bdb15D7c17eEA00d3F04f
