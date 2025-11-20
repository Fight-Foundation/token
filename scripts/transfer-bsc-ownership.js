const hre = require("hardhat");

async function main() {
    const contractAddress = "0x8bc033303b81c867dBF2E9276D3AFdb86e75dA71";
    const newOwner = "0x1381c63F11Fe73998d80e2b42876C64362cF98Ab";
    
    console.log("Transferring ownership of BSC contract...");
    console.log(`Contract: ${contractAddress}`);
    console.log(`New Owner: ${newOwner}`);
    
    const [signer] = await hre.ethers.getSigners();
    console.log(`Current signer: ${signer.address}`);
    
    const contract = await hre.ethers.getContractAt("FightOFTSecondary", contractAddress);
    
    // Check current owner
    const currentOwner = await contract.owner();
    console.log(`Current owner: ${currentOwner}`);
    
    if (currentOwner.toLowerCase() === newOwner.toLowerCase()) {
        console.log("✅ Already owned by multisig");
        return;
    }
    
    // Transfer ownership
    const tx = await contract.transferOwnership(newOwner);
    console.log(`Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`✅ Ownership transferred in block ${receipt.blockNumber}`);
    console.log(`Transaction: https://bscscan.com/tx/${tx.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
