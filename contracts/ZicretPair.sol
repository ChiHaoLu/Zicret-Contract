// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import "hardhat/console.sol";

contract ZicretPair {
    struct EncryptedInfo {
        PublicInfo publicInfo;
        PrivateInfo privateInfo;
    }

    struct PublicInfo {
        uint8 MBTI;
    }

    struct PrivateInfo {
        PersonalInfo personalInfo;
        Match matchInfo;
        Match matchRequest;
    }

    struct PersonalInfo {
        bytes32 twitter;
        bytes32 name;
    }

    struct Match {
        bytes32 gender;
        bytes32 nation;
        bytes32 town;
        bytes32 age;
        bytes32[] interest;
    }

    struct Weight {
        int256 gender;
        int256 nation;
        int256 town;
        int256 age;
        int256[] interest;
    }

    struct Pair {
        address target;
        uint8[] pubK;
        EncryptedInfo encryptedInfo;
    }

    struct SharingInfo {
        address target;
        bytes sharingInfo;
    }

    struct UserStats {
        uint256 onlineTimes;
        uint256 requestingTimes;
        uint256 requestedTimes;
        uint256 matchTimes;
    }

    bytes32 ANY_HASH = keccak256("Any");

    mapping(address => address[]) public successfulPair;
    mapping(bytes32 => bool) public pairRecored;
    mapping(address => UserStats) public userStats;

    event GetOnline(address sender, EncryptedInfo encryptedInfo, uint256 time);
    event RequestPair(address sender, Pair pairRequest, uint256 time);
    event ApprovePair(address sender, Pair pairRequest, uint256 time);
    event SendSharingInfo(
        address sender,
        SharingInfo sharingInfo,
        uint256 time
    );

    constructor() payable {}

    function online(EncryptedInfo memory encryptedInfo) public {
        userStats[msg.sender].onlineTimes += 1;
        emit GetOnline(msg.sender, encryptedInfo, block.timestamp);
    }

    function requestPair(Pair memory pairRequest) public {
        userStats[msg.sender].requestingTimes += 1;
        userStats[pairRequest.target].requestedTimes += 1;
        emit RequestPair(msg.sender, pairRequest, block.timestamp);
    }

    function approvePair(Pair memory pairApprovement) public {
        emit ApprovePair(msg.sender, pairApprovement, block.timestamp);
    }

    function getPairHash(address a, address b) public pure returns (bytes32) {
        if (a > b) {
            return keccak256((abi.encodePacked(a, b)));
        } else {
            return keccak256((abi.encodePacked(b, a)));
        }
    }

    function sendSharingInfo(SharingInfo memory sharingInfo) public {
        bytes32 pairHash = getPairHash(msg.sender, sharingInfo.target);
        if (!pairRecored[pairHash]) {
            pairRecored[pairHash] = true;
            successfulPair[msg.sender].push(sharingInfo.target);
            successfulPair[sharingInfo.target].push(msg.sender);
            userStats[msg.sender].matchTimes += 1;
            userStats[sharingInfo.target].matchTimes += 1;
        }
        emit SendSharingInfo(msg.sender, sharingInfo, block.timestamp);
    }

    error UnSortedInterest(bool isErrorInCaller, uint256 index);
    function calculatePSI(
        EncryptedInfo memory a,
        EncryptedInfo memory b,
        Weight memory weight
    ) public view returns (int256 score) {
        Match memory caller = a.privateInfo.matchRequest;
        Match memory callee = b.privateInfo.matchInfo;

        if (caller.gender == callee.gender || caller.gender == ANY_HASH) {
            score += weight.gender;
        }
        if (caller.nation == callee.nation || caller.nation == ANY_HASH) {
            score += weight.nation;
        }
        if (caller.town == callee.town || caller.town == ANY_HASH) {
            score += weight.town;
        }
        if (caller.age == callee.age || caller.age == ANY_HASH) {
            score += weight.age;
        }

        for (uint256 i = 0; i < caller.interest.length; i++) {
            if (i > 0 && caller.interest[i] <= caller.interest[i - 1]) {
                revert UnSortedInterest({ isErrorInCaller: true, index: i });
            }
            for (uint256 j = 0; j < callee.interest.length; j++) {
                if (j > 0 && callee.interest[j] <= callee.interest[j - 1]) {
                    revert UnSortedInterest({
                        isErrorInCaller: false,
                        index: j
                    });
                }
                if (caller.interest[i] == callee.interest[j]) {
                    score += weight.interest[i];
                }
            }
        }
    }
}
