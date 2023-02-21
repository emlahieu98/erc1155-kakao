# Kakao Project

#RUN

1. Copy file .env.example -> .env
   cp .env.example .env

2. Compile

npx hardhat compile

3. Run test case

npx hardhat test

4. Deploy project BSC Testnet Chain

npx hardhat run --network bscTestnet scripts/deploy.js

5. Verify smart contract

npx hardhat verify <xxx> --network bscTestnet "Constructor argument 1"
