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

> test
> REPORT_GAS=true npx hardhat test


  ZicretPair
    Deployment
      ✔ Should go online successfully
      ✔ Should request Pair successfully
      ✔ Should approve Pair successfully
      ✔ Should send SharingInfo successfully
      ✔ Should calculatePSI successfully
      ✔ Should fail if the interesets duplicated

·----------------------------------|----------------------------|-------------|-----------------------------·
|       Solc version: 0.8.17       ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
···································|····························|·············|······························
|  Methods                                                                                                  │
···············|···················|·············|··············|·············|···············|··············
|  Contract    ·  Method           ·  Min        ·  Max         ·  Avg        ·  # calls      ·  usd (avg)  │
···············|···················|·············|··············|·············|···············|··············
|  ZicretPair  ·  approvePair      ·          -  ·           -  ·      88004  ·            2  ·          -  │
···············|···················|·············|··············|·············|···············|··············
|  ZicretPair  ·  online           ·          -  ·           -  ·      76967  ·            2  ·          -  │
···············|···················|·············|··············|·············|···············|··············
|  ZicretPair  ·  requestPair      ·          -  ·           -  ·     132922  ·            2  ·          -  │
···············|···················|·············|··············|·············|···············|··············
|  ZicretPair  ·  sendSharingInfo  ·      30253  ·      184292  ·     107273  ·            4  ·          -  │
···············|···················|·············|··············|·············|···············|··············
|  Deployments                     ·                                          ·  % of limit   ·             │
···································|·············|··············|·············|···············|··············
|  ZicretPair                      ·          -  ·           -  ·    1720924  ·        5.7 %  ·          -  │
·----------------------------------|-------------|--------------|-------------|---------------|-------------·

  6 passing (457ms)
```

Produce the coverage report:

```shell
$ npm run coverage

> coverage
> npx hardhat coverage


Version
=======
> solidity-coverage: v0.8.11

Instrumenting for coverage...
=============================

> ZicretPair.sol

Compilation:
============

Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 6 typings!
Compiled 1 Solidity file successfully (evm target: london).

Network Info
============
> HardhatEVM: v2.22.1
> network:    hardhat



  ZicretPair
    Deployment
      ✔ Should go online successfully (102ms)
      ✔ Should request Pair successfully
      ✔ Should approve Pair successfully
      ✔ Should send SharingInfo successfully
      ✔ Should calculatePSI successfully (63ms)
      ✔ Should fail if the interesets duplicated


  6 passing (255ms)

-----------------|----------|----------|----------|----------|----------------|
File             |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------|----------|----------|----------|----------|----------------|
 contracts/      |      100 |    69.23 |      100 |    94.29 |                |
  ZicretPair.sol |      100 |    69.23 |      100 |    94.29 |        137,141 |
-----------------|----------|----------|----------|----------|----------------|
All files        |      100 |    69.23 |      100 |    94.29 |                |
-----------------|----------|----------|----------|----------|----------------|
```

Formet the code:

```shell
$ npm run format
```

## Deployment

### Local

Open a terminal

```shell
$ npm run node

> node
> npx hardhat node

Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (1 ETH)
Private Key: ...

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.
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
eth_blockNumber
eth_getBalance (6)
eth_getBlockByNumber
eth_blockNumber
eth_gasPrice
net_version (4)
eth_accounts
hardhat_metadata (10)
eth_accounts
hardhat_metadata (10)
eth_blockNumber
eth_getBlockByNumber
eth_feeHistory
eth_maxPriorityFeePerGas - Method not supported
eth_sendTransaction
  Contract deployment: ZicretPair
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0xee19a806897745784144089302313fcac67b9cdb47cf52a7158462dd0c725f06
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            1029748 of 30000000
  Block #1:            0xb37ccc12a2795a0106706186d8521a7849c079848aadade5ecd8a26b823bed48

eth_getTransactionByHash
```

### Testnet

These commands will use the account associated with the `PRIVATE_KEY` specified in your `.env` file. Please make sure you have enough ETH in this account to deploy contract.

```shell
$ npm run deploy:zircuit-testnet
// or
$ npm run deploy:sepolia-testnet
```

### Verify

#### Zircuit

These commands will use the `ZIRCUIT_API_KEY` specified in your `.env` file. Please make sure you have applied and filled it.

```shell
$ npx hardhat verify --network zircuit-testnet <zicretpair-contract-address-on-zircuit-testnet->
```

#### Scroll

These commands will use the `SCROLL_API_KEY` specified in your `.env` file. Please make sure you have applied and filled it.

```shell
$ npx hardhat verify --network zircuit-testnet <zicretpair-contract-address-on-zircuit-testnet>
```

#### Linea

These commands will use the `LINEA_API_KEY` specified in your `.env` file. Please make sure you have applied and filled it.

```shell
$ npx hardhat verify --network scrollSepolia <zicretpair-contract-address-on-scrollSepolia>
```
