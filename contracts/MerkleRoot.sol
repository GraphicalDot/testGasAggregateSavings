pragma solidity ^0.8.7;

import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";



contract MerkleProofCustom {

    using MerkleProof for bytes32[];

    function verifyProofOpenZepplin(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) public returns (bool) {
        return proof.verify(root, leaf);
    }


    function verifyProof(
        bytes32[] memory proof, 
        bytes32 root, 
        bytes32 leaf
    ) public returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash < proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == root;
    }
}