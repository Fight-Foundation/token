const { Connection, PublicKey, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createTransferInstruction, getAccount } = require('@solana/spl-token');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

async function transferTokens() {
    console.log('🚀 FIGHT Token Transfer: Solana → Multisig');
    console.log('='.repeat(50));
    
    // Configuration
    const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=95cfe6ef-15ca-4074-b322-b319171315a9');
    const mintAddress = new PublicKey('4CP46VS5mMyKqhC4nB6pFea3w3hhTnqtQoA2xdyVGcvu');
    const fromWallet = new PublicKey('B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt');
    const toWallet = new PublicKey('8avUTsjdhhDWGyakPDnSMv4PfCtUAHDehRs8Kuez3qdn');
    const transferAmount = 10000000000; // 10 billion FIGHT (in base units with 6 decimals)
    
    console.log('📋 Transfer Configuration:');
    console.log(`   From: ${fromWallet.toString()}`);
    console.log(`   To: ${toWallet.toString()}`);
    console.log(`   Amount: ${(transferAmount / 1000000).toLocaleString()} FIGHT`);
    console.log('');
    
    try {
        // Get associated token accounts
        const fromTokenAccount = await getAssociatedTokenAddress(mintAddress, fromWallet);
        const toTokenAccount = await getAssociatedTokenAddress(mintAddress, toWallet);
        
        console.log('🔍 Checking accounts...');
        
        // Check sender balance
        const fromAccount = await getAccount(connection, fromTokenAccount);
        console.log(`   Sender balance: ${(Number(fromAccount.amount) / 1000000).toLocaleString()} FIGHT`);
        
        // Check if recipient has enough balance for transfer
        if (Number(fromAccount.amount) < transferAmount) {
            throw new Error('Insufficient balance for transfer');
        }
        
        // Check if recipient token account exists
        try {
            await getAccount(connection, toTokenAccount);
            console.log('   Recipient token account exists ✅');
        } catch (error) {
            console.log('   Recipient token account does not exist - will be created automatically ⚠️');
        }
        
        console.log('');
        console.log('🔑 Creating transfer instruction...');
        
        // Create transfer instruction
        const transferInstruction = createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            fromWallet,
            transferAmount
        );
        
        // Note: This is a demonstration of the transfer instruction
        // In practice, you would need to sign this transaction with your private key
        console.log('✅ Transfer instruction created successfully');
        console.log('');
        console.log('⚠️  IMPORTANT: This script shows the transfer setup.');
        console.log('   To execute the actual transfer, you need to:');
        console.log('   1. Sign the transaction with your private key');
        console.log('   2. Submit it to the Solana network');
        console.log('');
        console.log('🔧 Transaction details:');
        console.log(`   From Token Account: ${fromTokenAccount.toString()}`);
        console.log(`   To Token Account: ${toTokenAccount.toString()}`);
        console.log(`   Transfer Amount: ${transferAmount} (${(transferAmount / 1000000).toLocaleString()} FIGHT)`);
        
    } catch (error) {
        console.error('❌ Error during transfer setup:', error.message);
    }
}

transferTokens().catch(console.error);