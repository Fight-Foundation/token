#!/usr/bin/env node
/**
 * FIGHT Token - Transfer BSC Ownership to Multisig
 * Transfers contract ownership on BSC to the multisig wallet
 */

const hre = require("hardhat");
require('dotenv').config();

// Configuration
const BSC_CONTRACT = "0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab";
const BSC_MULTISIG = "0x1381c63F11Fe73998d80e2b42876C64362cF98Ab";

async function main() {
    console.log('🥊 FIGHT Token - BSC Ownership Transfer');
    console.log('='.repeat(60));
    console.log('');
    
    try {
        // Get signer
        const [signer] = await hre.ethers.getSigners();
        console.log('📋 Configuration:');
        console.log(`   Contract: ${BSC_CONTRACT}`);
        console.log(`   Current Signer: ${signer.address}`);
        console.log(`   Target Multisig: ${BSC_MULTISIG}`);
        console.log('');
        
        // Get contract instance
        const contract = await hre.ethers.getContractAt("FightOFTSecondary", BSC_CONTRACT);
        
        // Check current owner
        console.log('🔍 Checking current owner...');
        const currentOwner = await contract.owner();
        console.log(`   Current Owner: ${currentOwner}`);
        console.log('');
        
        // Check if already owned by multisig
        if (currentOwner.toLowerCase() === BSC_MULTISIG.toLowerCase()) {
            console.log('✅ Contract is already owned by the multisig!');
            console.log('   No action needed.');
            return;
        }
        
        // Verify signer is the current owner
        if (currentOwner.toLowerCase() !== signer.address.toLowerCase()) {
            console.error('❌ Error: You are not the current owner!');
            console.log(`   Current owner: ${currentOwner}`);
            console.log(`   Your address: ${signer.address}`);
            console.log('');
            console.log('   Only the current owner can transfer ownership.');
            process.exit(1);
        }
        
        console.log('⚠️  WARNING: You are about to transfer ownership!');
        console.log('   After this transaction:');
        console.log('   - Only the multisig can manage the contract');
        console.log('   - You will lose admin access');
        console.log('   - This action cannot be reversed without multisig approval');
        console.log('');
        console.log('🔐 Transfer Details:');
        console.log(`   From: ${currentOwner}`);
        console.log(`   To: ${BSC_MULTISIG}`);
        console.log('');
        
        // Wait for user confirmation (in a real scenario, you'd use readline or similar)
        console.log('⏳ Proceeding with transfer...');
        console.log('');
        
        // Execute ownership transfer
        console.log('📝 Submitting transaction...');
        const tx = await contract.transferOwnership(BSC_MULTISIG);
        console.log(`   Transaction Hash: ${tx.hash}`);
        console.log(`   Waiting for confirmation...`);
        
        const receipt = await tx.wait();
        console.log('');
        console.log('✅ Transaction confirmed!');
        console.log(`   Block Number: ${receipt.blockNumber}`);
        console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`   View on BSCScan: https://bscscan.com/tx/${tx.hash}`);
        console.log('');
        
        // Verify the new owner
        console.log('🔍 Verifying new owner...');
        const newOwner = await contract.owner();
        console.log(`   New Owner: ${newOwner}`);
        
        if (newOwner.toLowerCase() === BSC_MULTISIG.toLowerCase()) {
            console.log('   ✅ Verification successful!');
        } else {
            console.log('   ❌ Verification failed!');
            console.log(`   Expected: ${BSC_MULTISIG}`);
            console.log(`   Got: ${newOwner}`);
        }
        
        console.log('');
        console.log('='.repeat(60));
        console.log('✅ BSC Ownership Transfer Complete!');
        console.log('='.repeat(60));
        console.log('');
        console.log('⚠️  IMPORTANT: Next Steps Required!');
        console.log('');
        console.log('The multisig must now call setDelegate() to configure LayerZero:');
        console.log('');
        console.log('1. Using the multisig, call:');
        console.log(`   contract.setDelegate("${BSC_MULTISIG}")`);
        console.log('');
        console.log('2. This allows the multisig to:');
        console.log('   - Configure LayerZero messaging library');
        console.log('   - Set send/receive libraries');
        console.log('   - Configure DVNs and executors');
        console.log('');
        console.log('3. Verify on BSCScan:');
        console.log(`   https://bscscan.com/address/${BSC_CONTRACT}#readContract`);
        console.log('');
        
    } catch (error) {
        console.error('');
        console.error('❌ Transfer failed!');
        console.error(`   Error: ${error.message}`);
        console.error('');
        
        if (error.code === 'CALL_EXCEPTION') {
            console.error('   This might be because:');
            console.error('   - The contract does not exist at the specified address');
            console.error('   - You are not connected to the correct network');
            console.error('   - The contract ABI does not match');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            console.error('   Insufficient BNB for gas fees');
        }
        
        process.exit(1);
    }
}

// Execute
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
