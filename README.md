# ZicretPair Contract

> Unlock a new dimension of privacy and decentralized connection with ZicretPair, the avaunt-grade social matching platform.

## Getting Started

-   Node Version: v20.11.1

1. Clone the repo

```
$ git clone https://github.com/ChiHaoLu/ZicretPair-Contract.git
```

2. Make sure the `.env` arguments are same as your image. (add your private key of account which has enough ether in zircuit testnet).

```
$ cp .env.example .env
```

3. Prepare the packages.

```
$ npm run install
```

---

## Development

Compile the contract:

```shell
$ npm run compile

> compile
> npx hardhat compile

Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 6 typings!
Compiled 1 Solidity file successfully (evm target: london).
```

Test the contract:

```shell
$ npm run test
```

Produce the coverage report:

```shell
$ npm run coverage
```

Formet the code:

```shell
$ npm run format
```

---

## Deployment & Verify

These commands will use the account associated with the `PRIVATE_KEY` and `<netowrk_name>_API_KEY` specified in your `.env` file. Please make sure you have enough ETH in this account to deploy contract.

### Local

Open a terminal

```shell
$ npm run node
```

Then open another terminal:

```shell
$ npm run deploy:local
>
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
ZicretPair deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

You can see below logs in the node (first) terminal:

```shell
eth_sendTransaction
  Contract deployment: ZicretPair
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0xee19a806897745784144089302313fcac67b9cdb47cf52a7158462dd0c725f06
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            1029748 of 30000000
  Block #1:            0xb37ccc12a2795a0106706186d8521a7849c079848aadade5ecd8a26b823bed48
```

### Zircuit Testnet

```shell
$ npm run deploy:zircuit-testnet
>
Compiled 1 Solidity file successfully (evm target: london).
Deploying contracts with the account: 0x8Fc8ecf8A75877E51aa595Bb1a02CF3804b24613
ZicretPair deployed to: 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
```

```shell
$ npx hardhat verify --network zircuit_testnet 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
>
Successfully submitted source code for contract
contracts/ZicretPair.sol:ZicretPair at 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ZicretPair on the block explorer.
https://explorer.zircuit.com/address/0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38#code
```

### Scroll Sepolia

```shell
$ npm run deploy:scroll-sepolia
>
Deploying contracts with the account: 0x8Fc8ecf8A75877E51aa595Bb1a02CF3804b24613
ZicretPair deployed to: 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
```

```shell
$ npx hardhat verify --network scroll_sepolia 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
```

### Linea Goerli

```shell
$ npm run deploy:linea-goerli
>
Deploying contracts with the account: 0x8Fc8ecf8A75877E51aa595Bb1a02CF3804b24613
ZicretPair deployed to: 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
```

```shell
$ npx hardhat verify --network linea_goerli 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
```

### Thundercore Testnet

```shell
$ npm run deploy:thunder-testnet
>
Deploying contracts with the account: 0x8Fc8ecf8A75877E51aa595Bb1a02CF3804b24613
ZicretPair deployed to: 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
```
```shell
$ npx hardhat verify --network thunder_testnet 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
>
Successfully submitted source code for contract
contracts/ZicretPair.sol:ZicretPair at 0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ZicretPair on the block explorer.
https://explorer-testnet.thundercore.com/address/0x0C25d1B0E7d1fdB384C5E25cC6bFdC18bA3dEf38#code
```