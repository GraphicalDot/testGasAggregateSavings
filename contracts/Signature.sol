pragma solidity 0.8.17;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract SignatureVerification {

    bytes32 public constant EIP712_DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 constant BURN_STRUCT_HASH = keccak256("StructBurn(uint256 timestamp,address signer,uint256 tokenId)");

    error WrongSignatureLength();
    mapping (address => bytes) signatures;
    bytes32 public hashedName = keccak256(bytes("https://www.xyz"));
    bytes32 public hashedVersion = keccak256(bytes("1.0.0"));
    uint256 public chainId = 137;
    address public contractAddress = 0xE2097547261B7F8d7C39d4A5BCd9041cBFCC8C62;

    /**
     * @dev The signature has an invalid length.
     */
    function getDomainSeperator(address _address) public view returns(bytes32){
        return  keccak256(abi.encode(EIP712_DOMAIN_TYPEHASH, 
                            hashedName, 
                            hashedVersion, 
                            chainId, _address));
    }

    function burnHash(
         bytes memory data_,
        bytes memory signature_) public  pure returns (bytes32){
       (uint256 _timestamp,
        address _signer,
        uint256 _tokenId) = abi.decode(data_, (uint256,address,uint256));

       bytes32 _structHash = keccak256(
                abi.encode(
                    BURN_STRUCT_HASH,
                    _timestamp,  
                    _signer,
                    _tokenId));
        return  _structHash;
    }   

    function checkRecoveredBurnAddress(
                address _contractAddress,
        bytes memory data_,
        bytes memory signature_   
    ) external view returns(address) { 


        bytes32 _burnStructHash = burnHash(data_, signature_);
            bytes32 hash = keccak256(abi.encodePacked("\x19\x01", getDomainSeperator(_contractAddress), _burnStructHash));
        address _recovered = ECDSA.recover(hash, signature_);
        return _recovered;
        }

    function checkEIP721Sig(
        bytes32 datahash_,
        bytes memory signature_   
    ) external view returns(address) { 


        bytes32 hash = keccak256(abi.encodePacked("\x19\x01", getDomainSeperator(contractAddress), datahash_));
        address _recovered = ECDSA.recover(hash, signature_);
        return _recovered;
        }



    function getMessageHash(
        address _to,
        uint _amount,
        string memory _message,
        uint _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _amount, _message, _nonce));
    }

    function getEthSignedMessageHash(
        bytes32 _messageHash
    ) public pure returns (bytes32) {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    function sstoreCost(bytes memory signature) public  {
        signatures[msg.sender] = signature;
    }

    function verifySignatures(
        bytes32[] calldata dataHashes,
        bytes[] calldata signatures,
        address[] calldata senders
     ) external returns (bool[] memory){
       require(dataHashes.length == signatures.length 
        && signatures.length == senders.length, "Lengths of input arrays must be equal");

        bool[] memory results = new bool[](signatures.length);
        for (uint256 i = 0; i < signatures.length; i++) {
            bool result = this.verifySignature(dataHashes[i], signatures[i], senders[i]);
            results[i] = result;
        }
        return results;
    }


    function verifySignature(
        bytes32 dataHash,
        bytes memory signature,
        address sender    
    )  public returns (bool) {
        // signatures[msg.sender] = signature;
        // address expectedSigner = smartAccountOwners[smartAccount];
        // if (expectedSigner == address(0))
        //     revert NoOwnerRegisteredForSmartAccount(smartAccount);
        if (signature.length < 65) revert WrongSignatureLength();
        // address recovered = (dataHash.toEthSignedMessageHash()).recover(
        //     signature
        // );
        // if (expectedSigner == recovered) {
        //     return true;
        // }
        // recovered = dataHash.recover(signature);
        // if (expectedSigner == recovered) {
        //     return true;
        // }

        return sender == ECDSA.recover(dataHash, signature);
    }

}