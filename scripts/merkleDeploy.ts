async function main() {
  const MerkleProof = await ethers.getContractFactory("MerkleProof");
  const merkleProof = await MerkleProof.deploy();

  console.log("MerkleProof deployed to:", merkleProof.address);
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});