import * as crypto from "crypto"

// 雙方共享的橢圓曲線 - secp256k1
const curve = "secp256k1"

// 雙方各自生成一對公私鑰
const alice = crypto.createECDH(curve)
alice.generateKeys()
const alicePublicKey = alice.getPublicKey()

const bob = crypto.createECDH(curve)
bob.generateKeys()
const bobPublicKey = bob.getPublicKey()

// 編碼公鑰 - 送出公鑰
const alicePublicKeyUint8Array = Buffer.from(alicePublicKey, "base64")
console.log("Sending public key: ", alicePublicKeyUint8Array)
const bobPublicKeyUint8Array = Buffer.from(bobPublicKey, "base64")
console.log("Sending public key: ", bobPublicKeyUint8Array)

// 雙方使用自己的私鑰和對方的公鑰來計算共享密鑰
const aliceSharedKey = alice.computeSecret(bobPublicKeyUint8Array)
const bobSharedKey = bob.computeSecret(alicePublicKeyUint8Array)
console.log(
    "Sharing key should be the same: ",
    aliceSharedKey,
    " vs. ",
    bobSharedKey
)

// 加密明文 -> 編碼密文 -> 送出訊息
const message = "Hello, Bob!"
const iv = new Buffer(crypto.randomBytes(16))
const ivstring = iv.toString("hex").slice(0, 16)
console.log("Random bytes: ", ivstring) // used in front-end
const aliceCipher = crypto.createCipheriv("aes-256-cbc", aliceSharedKey, iv)
const aliceEncrypted = Buffer.concat([
    aliceCipher.update(message, "utf8"),
    aliceCipher.final()
])
const aliceEncryptedInHex = "0x" + aliceEncrypted.toString("hex")
console.log("Alice sends encrypted information: ", aliceEncryptedInHex)

// 接收訊息 -> 解碼密文 -> 解密密文 -> 得到明文
const fromHexString = (hexString) =>
    Uint8Array.from(
        hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    )
const encrypted = fromHexString(aliceEncryptedInHex.slice(2))
const bobDecipher = crypto.createDecipheriv("aes-256-cbc", bobSharedKey, iv)
const bobDecrypted = Buffer.concat([
    bobDecipher.update(encrypted),
    bobDecipher.final()
])

console.log(
    "Bob receives and decrypt information:",
    bobDecrypted.toString("utf8")
)
