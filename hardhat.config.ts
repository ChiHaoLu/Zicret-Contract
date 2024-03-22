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
        scroll_sepolia: {
            url: "https://sepolia-rpc.scroll.io" || "",
            accounts: [process.env.PRIVATE_KEY as string]
        },
        linea_goerli: {
            url: process.env.LINEA_GOERLI_NODE_URL as string,
            accounts: [process.env.PRIVATE_KEY as string]
        }
    },
    etherscan: {
        apiKey: {
            zircuit_testnet: process.env.ZIRCUIT_API_KEY as string,
            scroll_sepolia: process.env.SCROLL_API_KEY as string,
            linea_goerli: process.env.LINEA_API_KEY as string
        },
        customChains: [
            {
                network: "zircuit_testnet",
                chainId: 48899,
                urls: {
                    apiURL: "https://explorer.zircuit.com/api/contractVerifyHardhat",
                    browserURL: "https://explorer.zircuit.com"
                }
            },
            {
                network: "scroll_sepolia",
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
