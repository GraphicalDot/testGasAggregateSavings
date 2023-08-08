





# Python script that signs EIP712 structs that can be validated
# by EVM smart contracts.
#
# Copyright (c) 2021 Alexis Robert <github@me.ale6.net>
#
# Dependencies:
#   coincurve==15.0.1
#   eip712-structs==1.1.0

import os
from xmlrpc.client import Boolean
import sha3
from web3 import Web3
from eip712_structs import EIP712Struct, Address, String, Uint, Bytes, Array
from eip712_structs import make_domain
from eth_utils import big_endian_to_int
from coincurve import PrivateKey, PublicKey
import datetime
from eth_abi import encode
import binascii

NAME = 'https://www.xyz'
VERSION = '1.0.0'

#when you deploy on localtestnet the chainID will alwaysbe 1
CHAIN_ID = 137
CONTRACT_ADDR = '0xE2097547261B7F8d7C39d4A5BCd9041cBFCC8C62'


w3 = Web3(Web3.HTTPProvider())
keccak_hash = lambda x : sha3.keccak_256(x).digest()
DOMAIN = make_domain(name=NAME,
                        version=VERSION,
                        chainId=CHAIN_ID,
                        verifyingContract=CONTRACT_ADDR)

PRIVATE_KEY = ""
print ("DOMAIN Sperator :", DOMAIN.hash_struct().hex())

class StructBurn(EIP712Struct):
    timestamp = Uint(256)
    signer = Address()
    tokenId = Uint(256)

def burn_token_data(token_id, private_key):
    SIGNER = w3.eth.account.from_key(private_key).address
    TIMESTAMP = int(datetime.datetime.utcnow().strftime("%s"))
    struct_instance = StructBurn(timestamp=TIMESTAMP,
                signer=SIGNER,
                gated = 0,
                tokenId = token_id)
    signable_bytes = struct_instance.signable_bytes(DOMAIN)
    pk = PrivateKey.from_hex(private_key.replace("0x", ""))
    signature = pk.sign_recoverable(signable_bytes, hasher=keccak_hash)
    v = signature[64] + 27
    r = big_endian_to_int(signature[0:32])
    s = big_endian_to_int(signature[32:64])

    final_sig = r.to_bytes(32, 'big') + s.to_bytes(32, 'big') + v.to_bytes(1, 'big')
    data = encode(['uint256','address', 'uint256'], 
            [TIMESTAMP, SIGNER, token_id])
    print ("Domain Seperator", DOMAIN)
    print ("SIGNER: ", SIGNER)
    print ("Struct Hash: ", "0x" + struct_instance.hash_struct().hex())
    print ("BURN TOKEN Sig: ", "0x" + final_sig.hex())
    print ("BURN TOKEN  Data : ", "0x" + data.hex())
    return (struct_instance.hash_struct().hex(), "0x" + final_sig.hex(), SIGNER)

def generate_burn_token_data():
    data_hashes = []
    signatures = []
    senders = []
    for token_id in range(10, 20):
        (struct_hash, signature, sender ) = burn_token_data(token_id, PRIVATE_KEY)
        data_hashes.append('0x' + struct_hash)
        signatures.append(signature)
        senders.append(sender)
    print (f'StructHashes = {data_hashes}')
    print (f'Signatures = {signatures}')
    print (f'Senders = {senders}')

generate_burn_token_data()