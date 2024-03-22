import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import hre, { ethers } from "hardhat"
import {
    encryptLocalProfile,
    encryptedInfoStructOutputToStruct,
    getPkAndSignersFromHH,
    LocalProfiles
} from "../scripts/utils"

import { getSharedSecret, getPublicKey } from "../scripts/ecdh"
import { ZicretPair } from "../typechain-types"

function expectEqObj(obj1: any, obj2: any) {
    expect(JSON.stringify(obj1, null, 4)).to.equal(
        JSON.stringify(obj2, null, 4)
    )
}

describe("ZicretPair", function () {
    async function deployZicretPair() {
        const [userA, userB, userC] = await getPkAndSignersFromHH()
        const signer = new hre.ethers.Wallet(userA.key)

        // Test for privateKey extract from the accounts of hardhat local node
        expect(signer.address).to.equal(userA.signer.address)

        // Test for ECDH
        const secretA = getSharedSecret(userA.key, getPublicKey(userB.key))
        const secretB = getSharedSecret(userB.key, getPublicKey(userA.key))
        expectEqObj(secretA, secretB)

        const ZicretPair = await hre.ethers.getContractFactory("ZicretPair")
        const zicretPair = await ZicretPair.deploy()

        const A_EncryptedInfo = encryptLocalProfile(LocalProfiles[0])
        const B_EncryptedInfo = encryptLocalProfile(LocalProfiles[1])
        const C_EncryptedInfo = encryptLocalProfile(LocalProfiles[2])

        return {
            zicretPair,
            userA,
            A_EncryptedInfo,
            userB,
            B_EncryptedInfo,
            userC,
            C_EncryptedInfo
        }
    }

    describe("Unit Test", function () {
        it("Should go online successfully", async function () {
            const { zicretPair, userA, A_EncryptedInfo } =
                await loadFixture(deployZicretPair)

            const beforeUserStats = await zicretPair.userStats(
                userA.signer.address
            )
            expect(beforeUserStats[0]).to.equal(0)

            const tx = await zicretPair.online(A_EncryptedInfo)
            await tx.wait()
            const filter = zicretPair.filters.GetOnline
            const events = await zicretPair.queryFilter(filter)
            const event = events[0]

            expect(event.fragment.name).to.equal("GetOnline")
            const args = event.args
            expect(args.sender).to.equal(userA.signer.address)
            expectEqObj(
                encryptedInfoStructOutputToStruct(args.encryptedInfo),
                A_EncryptedInfo
            )

            const afterUserStats = await zicretPair.userStats(
                userA.signer.address
            )
            expect(afterUserStats[0]).to.equal(1)
        })

        it("Should request Pair successfully", async function () {
            const { zicretPair, userA, A_EncryptedInfo, userB } =
                await loadFixture(deployZicretPair)

            const beforeA = await zicretPair.userStats(userA.signer.address)
            expect(beforeA[1]).to.equal(0)
            const beforeB = await zicretPair.userStats(userB.signer.address)
            expect(beforeB[2]).to.equal(0)

            const pairReq: ZicretPair.PairStruct = {
                target: userB.signer.address,
                pubK: [...getPublicKey(userA.key)],
                encryptedInfo: A_EncryptedInfo
            }

            const tx = await zicretPair.requestPair(pairReq)
            await tx.wait()
            const filter = zicretPair.filters.RequestPair
            const events = await zicretPair.queryFilter(filter)
            const event = events[0]

            expect(event.fragment.name).to.equal("RequestPair")
            const args = event.args
            expect(args.sender).to.equal(userA.signer.address)
            expect(args.pairRequest.target).to.equal(pairReq.target)
            expectEqObj(
                args.pairRequest.pubK.map((i) => {
                    return i.toString()
                }),
                pairReq.pubK.map((i) => {
                    return i.toString()
                })
            )
            expectEqObj(
                encryptedInfoStructOutputToStruct(
                    args.pairRequest.encryptedInfo
                ),
                A_EncryptedInfo
            )

            const afterA = await zicretPair.userStats(userA.signer.address)
            expect(afterA[1]).to.equal(1)
            const afterB = await zicretPair.userStats(userB.signer.address)
            expect(afterB[2]).to.equal(1)
        })

        it("Should approve Pair successfully", async function () {
            const { zicretPair, userA, A_EncryptedInfo, userB } =
                await loadFixture(deployZicretPair)

            const pairReq: ZicretPair.PairStruct = {
                target: userB.signer.address,
                pubK: [...getPublicKey(userA.key)],
                encryptedInfo: A_EncryptedInfo
            }

            const tx = await zicretPair.approvePair(pairReq)
            await tx.wait()
            const filter = zicretPair.filters.ApprovePair
            const events = await zicretPair.queryFilter(filter)
            const event = events[0]

            expect(event.fragment.name).to.equal("ApprovePair")
            const args = event.args
            expect(args.sender).to.equal(userA.signer.address)
            expect(args.pairRequest.target).to.equal(pairReq.target)
            expectEqObj(
                args.pairRequest.pubK.map((i) => {
                    return i.toString()
                }),
                pairReq.pubK.map((i) => {
                    return i.toString()
                })
            )
            expectEqObj(
                encryptedInfoStructOutputToStruct(
                    args.pairRequest.encryptedInfo
                ),
                A_EncryptedInfo
            )
        })

        it("Should send SharingInfo successfully", async function () {
            const { zicretPair, userA, userB } =
                await loadFixture(deployZicretPair)

            const pairHash = await zicretPair.getPairHash(
                userA.signer.address,
                userB.signer.address
            )
            const pairRecored = await zicretPair.pairRecored(pairHash)
            expect(pairRecored).to.equal(false)
            const beforeA = await zicretPair.userStats(userA.signer.address)
            expect(beforeA[3]).to.equal(0)
            const beforeB = await zicretPair.userStats(userB.signer.address)
            expect(beforeB[3]).to.equal(0)

            const sharingInfoA: ZicretPair.SharingInfoStruct = {
                target: userB.signer.address,
                sharingInfo: "0x1234"
            }

            const sharingInfoB: ZicretPair.SharingInfoStruct = {
                target: userA.signer.address,
                sharingInfo: "0x1234"
            }

            const tx1 = await zicretPair.sendSharingInfo(sharingInfoA)
            await tx1.wait()
            const filter = zicretPair.filters.SendSharingInfo
            const events1 = await zicretPair.queryFilter(filter)
            const event1 = events1[0]
            expect(event1.fragment.name).to.equal("SendSharingInfo")
            const args1 = event1.args
            expect(args1.sender).to.equal(userA.signer.address)
            expect(args1.sharingInfo.target).to.equal(sharingInfoA.target)
            expect(args1.sharingInfo.sharingInfo).to.equal(
                sharingInfoA.sharingInfo
            )
            const afterA = await zicretPair.userStats(userA.signer.address)
            expect(afterA[3]).to.equal(1)
            const pairRecoredAfter = await zicretPair.pairRecored(pairHash)
            expect(pairRecoredAfter).to.equal(true)
            const pairListA = await zicretPair.successfulPair(
                userA.signer.address,
                0
            )
            expect(pairListA).to.equal(userB.signer.address)

            const tx2 = await zicretPair
                .connect(userB.signer)
                .sendSharingInfo(sharingInfoB)
            await tx2.wait()
            const events2 = await zicretPair.queryFilter(filter)
            const event2 = events2[1]
            expect(event2.fragment.name).to.equal("SendSharingInfo")
            const args2 = event2.args
            expect(args2.sender).to.equal(userB.signer.address)
            expect(args2.sharingInfo.target).to.equal(sharingInfoB.target)
            expect(args2.sharingInfo.sharingInfo).to.equal(
                sharingInfoB.sharingInfo
            )
            const afterB = await zicretPair.userStats(userB.signer.address)
            expect(afterB[3]).to.equal(1)
            const pairListB = await zicretPair.successfulPair(
                userB.signer.address,
                0
            )
            expect(pairListB).to.equal(userA.signer.address)
        })

        it("Should calculatePSI successfully", async function () {
            const { zicretPair, A_EncryptedInfo, B_EncryptedInfo } =
                await loadFixture(deployZicretPair)
            const weight1: ZicretPair.WeightStruct = {
                gender: 10n,
                nation: 10n,
                town: 10n,
                age: 10n,
                interest: [10n, 10n, 10n, 10n, 10n, 10n]
            }
            const matchScore1 = await zicretPair.calculatePSI(
                A_EncryptedInfo,
                B_EncryptedInfo,
                weight1
            )
            expect(matchScore1).to.equal(70)

            const weight2: ZicretPair.WeightStruct = {
                gender: 100n,
                nation: 100n,
                town: 10n,
                age: 100n,
                interest: [10n, 20n, 10n, 10n, -30n]
            }
            const matchScore2 = await zicretPair.calculatePSI(
                B_EncryptedInfo,
                A_EncryptedInfo,
                weight2
            )
            expect(matchScore2).to.equal(300)
        })

        it("Should fail if the interesets duplicated", async function () {
            const { zicretPair, A_EncryptedInfo, C_EncryptedInfo } =
                await loadFixture(deployZicretPair)
            const weight: ZicretPair.WeightStruct = {
                gender: 10n,
                nation: 10n,
                town: 10n,
                age: 10n,
                interest: [10n, 10n, 10n, 10n, 10n, 10n]
            }

            expect(
                zicretPair.calculatePSI(
                    A_EncryptedInfo,
                    C_EncryptedInfo,
                    weight
                )
            )
                .to.be.revertedWithCustomError(zicretPair, "UnSortedInterest")
                .withArgs(false, 2)
            expect(
                zicretPair.calculatePSI(
                    C_EncryptedInfo,
                    A_EncryptedInfo,
                    weight
                )
            )
                .to.be.revertedWithCustomError(zicretPair, "UnSortedInterest")
                .withArgs(false, 2)
        })
    })

    describe("E2E Test", function () {
        it("Should decrypt the SharingInfo successfully", async function () {
            // TODO
        })
    })
})
