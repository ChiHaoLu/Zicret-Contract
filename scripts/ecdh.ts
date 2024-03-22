import { ethers } from "hardhat"
import { secp256k1 } from "@noble/curves/secp256k1"

export function getPublicKey(priv: string) {
    return secp256k1.getPublicKey(ethers.toBigInt(priv))
}

export function getSharedSecret(priv: string, pub: Uint8Array) {
    return secp256k1.getSharedSecret(ethers.toBigInt(priv), pub)
}
