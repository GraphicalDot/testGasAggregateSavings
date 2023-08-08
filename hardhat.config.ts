
require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require("hardhat-gas-reporter");
import { task } from "hardhat/config";
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

const fs = require('fs');
const path = require('path');
require('dotenv').config()



let PRIVATE_KEY = process.env.PRIVATE_KEY;
let MNEMONIC = process.env.MNEMONIC;


// let RELAYER_ONE = process.env.RELAYER_ONE;
// let RELAYER_TWO = process.env.RELAYER_TWO;
// let RELAYER_THREE = process.env.RELAYER_THREE;
// let RELAYER_FOUR = process.env.RELAYER_FOUR;


// let RELAYER_ONE = process.env.RELAYER_ONE;
// let RELAYER_TWO = process.env.RELAYER_TWO;
// let RELAYER_THREE = process.env.RELAYER_THREE;
// let RELAYER_FOUR = process.env.RELAYER_FOUR;

task("deploy", "Compiles and deploys the MerkleProof contract", async (taskArgs, hre) => {
  await hre.run('compile');
  
  const MerkleProof = await hre.ethers.getContractFactory("MerkleProof");
  const merkleProof = await MerkleProof.deploy();
  
  console.log("MerkleProof deployed to:", merkleProof.address);

  const leaf = '0xe4a73fe165956c6c0f6e0ca13b59b29ce18eb9142123fb37f419e4c85a0d2a12'
  const root = '0x78a7ebb4440343522038adbd6b2a9723a86fb5e5551d3ce145ef46fc9664cbe6'
  const proof = ["0x9a5dabaf28ed21793a7c2cab1962900661ac59c737ef7228601afbba89346c74", "0x1a3064570bc52523294cfc8c5a2fdd6dd57015cf9a79029433230f135f5705a2", "0x57a826665b4309965ae635a984d7af316a9a7c48f9540096721113810d64d77d", "0x567235a8b424b8f3c98d6334a5820b7a41b64f6f8fef8c8a35216acba2be91df", "0xc4c4c0c90a03976ae947337573ec10ed8f49b82dafac597e24826570b141c43f", "0x2df4cde5daeef36dc074e2f15d8db5e2831071bf746af84539d4132611d6f68c", "0x8ee0a8adead11f36b56bd4d3ced0864f55d5b7267e7f1dd8d254b65c9aba014b", "0xa60cc905ca3868c72be5ce6342204920744b525308d6eaa8c2bfbb6631a22f72", "0xc1df56d6f257d3ba9234720cfb16e002fe5db08cc35f1dc5250637614dbe8be6", "0xbd6eba2fe77c15ff4f501ff1f526a6b718bf43cfb9491bccf2192fd9b109396c", "0x6e9424c8cf1b0c1902c708841bc8fc666ac265b69060dc26cdffb68e2ee0c31f", "0x6f11a7d4a8ac25e2c6752347d9e5bd6be60c849a47a065600a0ace5f6b5f6332", "0xecc0f6bc7df068b4c38a8fa6e8fd3c46630a28fce3ead23f50011eb75172bc28", "0x5c0cf14d9e0e48008e137e32227cad1417c68ab1acaaed9f72be97850126518c", "0x8f7905d8e7b319d414ee6dedde5428bfe1fa7f18320166f1e2e4473ef33c99bc", "0x7489d4e285ff8259c16f5ab110ed71cd540a531c2952c307c9dc98ce2832aab9"]
 

  const gasEstimate = await merkleProof.estimateGas.verifyProof(proof, root, leaf);

  console.log("Estimated gas for verifyProof:", gasEstimate.toString());

  console.log(`Proof is ${proof}`)
  const verificationResult = await merkleProof.verifyProof(proof, root, leaf);
  console.log("Verification result:", verificationResult);


});

const argv = require('yargs/yargs')()
  .env('')
  .options({
    ci: {
      type: 'boolean',
      default: false,
    },
    gas: {
      alias: 'enableGasReport',
      type: 'boolean',
      default: false,
    },
    mode: {
      alias: 'compileMode',
      type: 'string',
      choices: [ 'production', 'development' ],
      default: 'development',
    },
    compiler: {
      alias: 'compileVersion',
      type: 'string',
      default: '0.8.4',
    },
  })
  .argv;

if (argv.enableGasReport) {
  require('hardhat-gas-reporter');
}


const withOptimizations = argv.enableGasReport || argv.compileMode === 'production';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
      allowUnlimitedContractSize: !withOptimizations,
      accounts: {
          "mnemonic": MNEMONIC,
          "path": "m/44'/60'/0'/0",
          "initialIndex": 0,
          "count": 6
        }
        },
    localhost: {
	    url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY],
      blockGasLimit: 10000000000,
      allowUnlimitedContractSize: withOptimizations,
    },

    // zksyncTestnet: {
    //   url:'https://zksync2-testnet.zksync.dev',
    //   accounts: [`0x${TESTNET_OWNER_PRIVATE_KEY}`, `0x${TESTNET_FEECCOLLECTOR_PRIVATE_KEY}`],
    //   gasPrice: 45000000000, 
    //   gas: 8000000
    // },

    // fuji: {
    //   url: `${process.env.TESTNET_RPC_URL}`,
    //   accounts: [`0x${TESTNET_OWNER_PRIVATE_KEY}`, `0x${TESTNET_FEECCOLLECTOR_PRIVATE_KEY}`],
    //   gasPrice: 45000000000, 
    //   gas: 8000000
    // },

    // goerliETH: {
    //   url: `${process.env.GOERLI_ETH_RPC}`,
    //   accounts: [`0x${TESTNET_OWNER_PRIVATE_KEY}`, `0x${TESTNET_FEECCOLLECTOR_PRIVATE_KEY}`],
    //   gasPrice: 60000000000, 
    //   gas: 4000000
    // },

    // goerliArbitrum: {
    //   url: `${process.env.GOERLI_ETH_ARBITRUM}`,
    //   accounts: [`0x${TESTNET_OWNER_PRIVATE_KEY}`, `0x${TESTNET_FEECCOLLECTOR_PRIVATE_KEY}`],
    //   gasPrice: 7500000000, 
    //   gas: 6306400
    // },

    // polygon: {
    //   url: `${process.env.MAINNET_RPC_URL}`,
    //   accounts: [`0x${MAINNET_OWNER_PRIVATE_KEY}`, `0x${MAINNET_FEECCOLLECTOR_PRIVATE_KEY}`],
    //   gasPrice: 60000000000, 
    //   gas: 5306400
    // },

    // bnbTestChain: {
    //   url: `${process.env.BNB_TESTCHAIN_RPC_URL}`,
    //   accounts: [`0x${MAINNET_OWNER_PRIVATE_KEY}`, `0x${MAINNET_FEECCOLLECTOR_PRIVATE_KEY}`],
    //   gasPrice: 15333333333, 
    //   gas: 4006400
    // },

  },


  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  gasReporter: {
    currency: 'INR',
    gasPrice: 50 
  },
};


