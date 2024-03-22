import { config as dotEnvConfig } from "dotenv"
dotEnvConfig()
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        hardhat: {
            accounts: {
                count: 10,
                accountsBalance: "10000000000000000000"
            }
        },
        sepolia: {
            url: process.env.SEPOLIA_NODE_URL as string,
            accounts: [process.env.PRIVATE_KEY as string]
        },
        zircuit_testnet: {
            url: "https://zircuit1.p2pify.com",
            accounts: [process.env.PRIVATE_KEY as string]
        },
        scrollSepolia: {
            url: "https://sepolia-rpc.scroll.io" || "",
            accounts:
                process.env.PRIVATE_KEY !== undefined
                    ? [process.env.PRIVATE_KEY]
                    : []
        },
        lineaGoerli: {
            url: process.env.LINEA_GOERLI_NODE_URL as string,
            accounts:
                process.env.PRIVATE_KEY !== undefined
                    ? [process.env.PRIVATE_KEY]
                    : []
        }
    },
    etherscan: {
        apiKey: {
            zircuit_testnet: process.env.ZIRCUIT_API_KEY as string,
            scrollSepolia: process.env.SCROLL_API_KEY as string
        },
        customChains: [
            {
                network: "scrollSepolia",
                chainId: 534351,
                urls: {
                    apiURL: "https://sepolia-blockscout.scroll.io/api",
                    browserURL: "https://sepolia-blockscout.scroll.io/"
                }
            }
        ]
    }
}

export default config
