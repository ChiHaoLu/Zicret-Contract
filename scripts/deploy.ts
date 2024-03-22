import { ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    const ZicretPairFactory = await ethers.getContractFactory("ZicretPair")
    const ZicretPair = await ZicretPairFactory.deploy()
    console.log("ZicretPair deployed to:", ZicretPair.target)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
