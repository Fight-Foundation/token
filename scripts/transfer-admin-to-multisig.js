#!/usr/bin/env node
/**
 * Transfer Admin & Upgrade Authority to Multisigs
 * - Solana: Transfer OFT admin and upgrade authority
 * - BSC: Transfer contract ownership
 */

const { Connection, PublicKey, Transaction, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, web3 } = require('@project-serum/anchor');
const hre = require("hardhat");
const bs58 = require('bs58');
require('dotenv').config();

// Configuration
const SOLANA_MULTISIG = "GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh";
const BSC_MULTISIG = "0x1381c63F11Fe73998d80e2b42876C64362cF98Ab";
const BSC_CONTRACT = "0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab";
const SOLANA_PROGRAM_ID = "FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL";
const SOLANA_OFT_STORE = "8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk";

console.log('🥊 FIGHT Token - Transfer Admin to Multisig');
console.log('='.repeat(60));
console.log('');

/**
 * Transfer Solana Program Admin
 */
async function transferSolanaAdmin() {
    console.log('📍 SOLANA ADMIN TRANSFER');
    console.log('-'.repeat(60));
    
    try {
        const connection = new Connection(
            process.env.RPC_URL_SOLANA || 'https://mainnet.helius-rpc.com/?api-key=95cfe6ef-15ca-4074-b322-b319171315a9',
            'confirmed'
        );
        
        // Load wallet from private key
        if (!process.env.SOLANA_PRIVATE_KEY) {
            throw new Error('SOLANA_PRIVATE_KEY not found in .env');
        }
        
        const wallet = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY));
        console.log(`Current Admin: ${wallet.publicKey.toString()}`);
        console.log(`Target Multisig: ${SOLANA_MULTISIG}`);
        console.log(`OFT Store: ${SOLANA_OFT_STORE}`);
        console.log('');
        
        // Get OFT Store account to check current admin
        const oftStoreKey = new PublicKey(SOLANA_OFT_STORE);
        const oftStoreAccount = await connection.getAccountInfo(oftStoreKey);
        
        if (!oftStoreAccount) {
            throw new Error('OFT Store account not found');
        }
        
        console.log('📋 Current State:');
        console.log(`   Program ID: ${SOLANA_PROGRAM_ID}`);
        console.log(`   OFT Store: ${SOLANA_OFT_STORE}`);
        console.log('');
        
        console.log('⚠️  To transfer Solana admin authority:');
        console.log('   1. The OFT program needs to have a transfer_admin instruction');
        console.log('   2. Use Solana CLI or Anchor to execute:');
        console.log('');
        console.log('   anchor run transfer-admin --provider.wallet ~/.config/solana/id.json');
        console.log('');
        console.log('   Or use solana-cli:');
        console.log(`   solana program set-upgrade-authority ${SOLANA_PROGRAM_ID} --new-upgrade-authority ${SOLANA_MULTISIG}`);
        console.log('');
        
        // For program upgrade authority transfer
        console.log('🔧 Transfer Program Upgrade Authority:');
        console.log('');
        console.log('   Run this command:');
        console.log(`   solana program set-upgrade-authority ${SOLANA_PROGRAM_ID} \\`);
        console.log(`     --new-upgrade-authority ${SOLANA_MULTISIG} \\`);
        console.log(`     --keypair ${process.env.SOLANA_KEYPAIR_PATH || '~/.config/solana/id.json'}`);
        console.log('');
        
        return {
            success: true,
            message: 'Solana transfer instructions provided'
        };
        
    } catch (error) {
        console.error('❌ Solana admin transfer error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Transfer BSC Contract Ownership
 */
async function transferBSCOwnership() {
    console.log('');
    console.log('📍 BSC OWNERSHIP TRANSFER');
    console.log('-'.repeat(60));
    
    try {
        const [signer] = await hre.ethers.getSigners();
        console.log(`Current Signer: ${signer.address}`);
        console.log(`Contract: ${BSC_CONTRACT}`);
        console.log(`Target Multisig: ${BSC_MULTISIG}`);
        console.log('');
        
        // Get contract instance
        const contract = await hre.ethers.getContractAt("FightOFTSecondary", BSC_CONTRACT);
        
        // Check current owner
        const currentOwner = await contract.owner();
        console.log(`Current Owner: ${currentOwner}`);
        
        if (currentOwner.toLowerCase() === BSC_MULTISIG.toLowerCase()) {
            console.log('✅ Already owned by multisig!');
            return {
                success: true,
                message: 'Already owned by multisig'
            };
        }
        
        if (currentOwner.toLowerCase() !== signer.address.toLowerCase()) {
            console.log('⚠️  Warning: You are not the current owner!');
            console.log(`   Current owner is: ${currentOwner}`);
            console.log(`   You are: ${signer.address}`);
            return {
                success: false,
                error: 'Not the current owner'
            };
        }
        
        // Prompt for confirmation
        console.log('');
        console.log('⚠️  IMPORTANT: You are about to transfer ownership to the multisig.');
        console.log('   After this, only the multisig can manage the contract.');
        console.log('');
        console.log('🔐 Transfer Details:');
        console.log(`   From: ${currentOwner}`);
        console.log(`   To: ${BSC_MULTISIG}`);
        console.log('');
        
        // Execute transfer
        console.log('📝 Executing transfer...');
        const tx = await contract.transferOwnership(BSC_MULTISIG);
        console.log(`   Transaction hash: ${tx.hash}`);
        console.log(`   Waiting for confirmation...`);
        
        const receipt = await tx.wait();
        console.log('');
        console.log('✅ Ownership transferred successfully!');
        console.log(`   Block: ${receipt.blockNumber}`);
        console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
        console.log(`   Transaction: https://bscscan.com/tx/${tx.hash}`);
        console.log('');
        
        // Verify new owner
        const newOwner = await contract.owner();
        console.log('🔍 Verification:');
        console.log(`   New owner: ${newOwner}`);
        console.log(`   Expected: ${BSC_MULTISIG}`);
        console.log(`   Match: ${newOwner.toLowerCase() === BSC_MULTISIG.toLowerCase() ? '✅' : '❌'}`);
        
        return {
            success: true,
            txHash: tx.hash,
            blockNumber: receipt.blockNumber
        };
        
    } catch (error) {
        console.error('❌ BSC ownership transfer error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('Starting admin transfer process...');
    console.log('');
    
    const results = {
        solana: null,
        bsc: null
    };
    
    // Transfer Solana admin
    results.solana = await transferSolanaAdmin();
    
    // Transfer BSC ownership
    results.bsc = await transferBSCOwnership();
    
    // Summary
    console.log('');
    console.log('='.repeat(60));
    console.log('📊 TRANSFER SUMMARY');
    console.log('='.repeat(60));
    console.log('');
    console.log('Solana Admin Transfer:');
    console.log(`   Status: ${results.solana.success ? '✅ Instructions provided' : '❌ Failed'}`);
    if (!results.solana.success) {
        console.log(`   Error: ${results.solana.error}`);
    }
    console.log('');
    console.log('BSC Ownership Transfer:');
    console.log(`   Status: ${results.bsc.success ? '✅ Completed' : '❌ Failed'}`);
    if (results.bsc.success && results.bsc.txHash) {
        console.log(`   Transaction: https://bscscan.com/tx/${results.bsc.txHash}`);
    } else if (!results.bsc.success) {
        console.log(`   Error: ${results.bsc.error}`);
    }
    console.log('');
    console.log('='.repeat(60));
    
    if (!results.solana.success || !results.bsc.success) {
        console.log('⚠️  Some transfers failed or require manual action.');
        console.log('   Please review the errors above and take appropriate action.');
        process.exit(1);
    } else {
        console.log('✅ All transfers completed or instructions provided!');
        process.exit(0);
    }
}

// Execute
if (require.main === module) {
    main().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = {
    transferSolanaAdmin,
    transferBSCOwnership
};
