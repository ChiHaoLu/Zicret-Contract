import hre, { ethers } from "hardhat"
import { ZicretPair } from "../typechain-types/ZicretPair"
import type { LocalProfile } from "./types"
import type {
    BaseContract,
    BigNumberish,
    BytesLike,
    FunctionFragment,
    Result,
    Interface,
    EventFragment,
    AddressLike,
    ContractRunner,
    ContractMethod,
    Listener
} from "ethers"

function compareBytes32(a: BytesLike, b: BytesLike): number {
    const uintA = BigInt(a.toString())
    const uintB = BigInt(b.toString())
    if (uintA < uintB) {
        return -1
    } else if (uintA > uintB) {
        return 1
    } else {
        return 0
    }
}

export async function getPkAndSignersFromHH() {
    const signers = await hre.ethers.getSigners()
    return signers.map((s, index) => {
        return { signer: s, key: pkHHDefaultSigners[index + 1] }
    })
}

const pkHHDefaultSigners: { [key: number]: string } = {
    1: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    2: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    3: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    4: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    5: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    6: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
    7: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
    8: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
    9: "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
    10: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"
}

export const LocalProfiles: LocalProfile[] = [
    {
        publicInfo: {
            MBTI: "ESTJ"
        },
        privateInfo: {
            personalInfo: {
                twitter: "molly_1234",
                name: "Molly"
            },
            matchInfo: {
                gender: true,
                nation: "Taiwan",
                town: "Taipei",
                age: "2x",
                interest: ["i1", "i2", "i4", "i13"]
            },
            matchRequest: {
                gender: false,
                nation: "Any",
                town: "Any",
                age: "3x",
                interest: ["i1", "i2", "i4", "i6", "i8", "i10"]
            }
        }
    },
    {
        publicInfo: {
            MBTI: "ESTJ"
        },
        privateInfo: {
            personalInfo: {
                twitter: "alfred_5678",
                name: "Alfred"
            },
            matchInfo: {
                gender: false,
                nation: "Taiwan",
                town: "Kaohsiung",
                age: "3x",
                interest: ["i2", "i4", "i6", "i11"]
            },
            matchRequest: {
                gender: true,
                nation: "Taiwan",
                town: "Kaohsiung",
                age: "2x",
                interest: ["i1", "i2", "i7", "i11", "i13"]
            }
        }
    },
    {
        publicInfo: {
            MBTI: "INFP"
        },
        privateInfo: {
            personalInfo: {
                twitter: "usami_0000",
                name: "Usami"
            },
            matchInfo: {
                gender: false,
                nation: "Japan",
                town: "Kyoto",
                age: "3x",
                interest: ["i1", "i6", "i5", "i9", "i9"]
            },
            matchRequest: {
                gender: true,
                nation: "Taiwan",
                town: "Taipei",
                age: "2x",
                interest: ["i1", "i3", "i5", "i8", "i12", "i12"]
            }
        }
    }
]

function keccakString(str: string): string {
    return hre.ethers.keccak256(hre.ethers.toUtf8Bytes(str))
}

const MBTI: { [key: string]: number } = {
    ESTP: 0,
    ESFP: 1,
    ISTP: 2,
    ISFP: 3,
    ESTJ: 4,
    ESFJ: 5,
    ISTJ: 6,
    ISFJ: 7,
    ENTJ: 8,
    ENTP: 9,
    INTJ: 10,
    INTP: 11,
    ENFJ: 12,
    ENFP: 13,
    INFJ: 14,
    INFP: 15
}

export function encryptLocalProfile(
    localProfile: LocalProfile
): ZicretPair.EncryptedInfoStruct {
    return {
        publicInfo: {
            MBTI: MBTI[localProfile.publicInfo.MBTI] as BigNumberish
        },
        privateInfo: {
            personalInfo: {
                twitter: keccakString(
                    localProfile.privateInfo.personalInfo.twitter
                ),
                name: keccakString(localProfile.privateInfo.personalInfo.name)
            },
            matchInfo: {
                gender: keccakString(
                    localProfile.privateInfo.matchInfo.gender.toString()
                ),
                nation: keccakString(localProfile.privateInfo.matchInfo.nation),
                town: keccakString(localProfile.privateInfo.matchInfo.town),
                age: keccakString(localProfile.privateInfo.matchInfo.age),
                interest: localProfile.privateInfo.matchInfo.interest
                    .map(function (i) {
                        return keccakString(i)
                    })
                    .sort((a, b) => compareBytes32(a, b))
            },
            matchRequest: {
                gender: keccakString(
                    localProfile.privateInfo.matchRequest.gender.toString()
                ),
                nation: keccakString(
                    localProfile.privateInfo.matchRequest.nation
                ),
                town: keccakString(localProfile.privateInfo.matchRequest.town),
                age: keccakString(localProfile.privateInfo.matchRequest.age),
                interest: localProfile.privateInfo.matchRequest.interest
                    .map(function (i) {
                        return keccakString(i)
                    })
                    .sort((a, b) => compareBytes32(a, b))
            }
        }
    }
}

export function encryptedInfoStructOutputToStruct(
    structOutput: ZicretPair.EncryptedInfoStructOutput
): ZicretPair.EncryptedInfoStruct {
    return {
        publicInfo: {
            MBTI: Number(structOutput.publicInfo.MBTI)
        },
        privateInfo: {
            personalInfo: {
                twitter: structOutput.privateInfo.personalInfo
                    .twitter as string,
                name: structOutput.privateInfo.personalInfo.name as string
            },
            matchInfo: {
                gender: structOutput.privateInfo.matchInfo.gender as string,
                nation: structOutput.privateInfo.matchInfo.nation as string,
                town: structOutput.privateInfo.matchInfo.town as string,
                age: structOutput.privateInfo.matchInfo.age as string,
                interest: structOutput.privateInfo.matchInfo.interest
                    .map(function (i) {
                        return i as string
                    })
                    .sort((a, b) => compareBytes32(a, b))
            },
            matchRequest: {
                gender: structOutput.privateInfo.matchRequest.gender as string,
                nation: structOutput.privateInfo.matchRequest.nation as string,
                town: structOutput.privateInfo.matchRequest.town as string,
                age: structOutput.privateInfo.matchRequest.age as string,
                interest: structOutput.privateInfo.matchRequest.interest
                    .map(function (i) {
                        return i as string
                    })
                    .sort((a, b) => compareBytes32(a, b))
            }
        }
    }
}
