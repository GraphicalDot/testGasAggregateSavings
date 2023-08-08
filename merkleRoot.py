



from typing import List
import hashlib
import random
import os
import binascii
from web3 import Web3
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

def merkle_levels(number_of_keys):
    return math.ceil(math.log2(number_of_keys)) + 1


def hash_func(data: str) -> str:
    return w3.keccak(text = data).hex()

def calc_merkle_root(elements: List[str]) -> str:
    if len(elements) == 1:
        return elements[0]
    next_level = []
    for i in range(0, len(elements), 2):
        data = ''.join(sorted(elements[i:i+2]))
        next_level.append(hash_func(data))
    return calc_merkle_root(next_level)

def calc_merkle_proof(elements: List[str], element: str) -> List[str]:
    if len(elements) == 1:
        return []
    next_level = []
    proof = []
    for i in range(0, len(elements), 2):
        pair = sorted(elements[i:i+2])
        if element in pair:
            proof.append(pair[1] if element == pair[0] else pair[0])
            element = hash_func(''.join(pair))
        next_level.append(hash_func(''.join(pair)))
    return proof + calc_merkle_proof(next_level, element)


# Calculate Merkle root and proof for an example
elements = ['0x' + binascii.hexlify(os.urandom(32)).decode() for i in range(2**16)]
elements.sort()

merkle_root = calc_merkle_root(elements)

print ("Choosing a random element from elements");
random_element = random.choice(elements)

merkle_proof = calc_merkle_proof(elements, random_element)

# Print Merkle root and proof in hex format for Solidity
print ('Leaf: ',  random_element)
print("Merkle Root: ", merkle_root)
print("Merkle Proof: ", merkle_proof)


def validate_proof(root: bytes, leaf: bytes, proof: List[bytes]) -> bool:
    computed_hash = leaf
    for sibling in proof:
        computed_hash = w3.keccak(text=min(computed_hash, sibling) + max(computed_hash, sibling)).hex()

    return computed_hash == root

for proof in merkle_proof:
    print(proof)


print ("Is Merkle proof valid = ", validate_proof(merkle_root, random_element, merkle_proof))
