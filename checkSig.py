

from web3 import Web3
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

def generate_signature(private_key: str, msg: str):
    message = encode_defunct(text=msg)
    signed_message = w3.eth.account.sign_message(message, private_key)
    return signed_message.signature.hex()

def private_key_to_address(private_key):
   PA=w3.eth.account.from_key(private_key)
   return PA.address


generate_signature(private_key, data)
Out[12]: '0xe0f08f4b27274097c2f492001e0690d935e8b1bd056ecb52632a10d71d767e1c7b58457ab2096f15e79f6eb7a4c02b5b2a60489075e68ac610772452ea07f9231c'

In [13]: eth_signed_message_hash = "0xf59445120a896ce4e24c96ea5c9253495cb47fbbec130543934b7c361dca2931"

In [14]: generate_signature(private_key, eth_signed_message_hash)
Out[14]: '0x5a1cd9ab807104d97203842d2786623738a104a74d403113cc6bfb1ceabcbb6b38c72502dc2b94418543d2039b926d7c40a3a7f4cb506dd49346b3a9f02db6f91b'

In [15]: message_hash = Web3.solidityKeccak(['string'], [message])
    
     # Sign the message
     signed_message = web3.eth.account.signHash(message_hash, private_key)
    
     # Get signature details
     signature = dict()
     signature['message'] = message
     signature['messageHash'] = web3.toHex(message_hash)
     signature['r'] = web3.toHex(signed_message['r'])
     signature['s'] = web3.toHex(signed_message['s'])
     signature['v'] = signed_message['v']
    
     # print the signature
     print(json.dumps(signature, indent=2))
---------------------------------------------------------------------------
NameError                                 Traceback (most recent call last)
Cell In [15], line 1
----> 1 message_hash = Web3.solidityKeccak(['string'], [message])
      3 # Sign the message
      4 signed_message = web3.eth.account.signHash(message_hash, private_key)

NameError: name 'message' is not defined

In [16]: message_hash = Web3.solidityKeccak(['string'], [message])
    
     # Sign the message
     signed_message = web3.eth.account.signHash(eth_signed_message_hash, private_key)
    
     # Get signature details
     signature = dict()
     signature['message'] = message
     signature['messageHash'] = web3.toHex(message_hash)
     signature['r'] = web3.toHex(signed_message['r'])
     signature['s'] = web3.toHex(signed_message['s'])
     signature['v'] = signed_message['v']
    
     # print the signature
     print(json.dumps(signature, indent=2))









