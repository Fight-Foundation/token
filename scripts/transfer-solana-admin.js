#!/usr/bin/env node
/**
 * FIGHT Token - Transfer Solana OFT Admin to Multisig
 * Transfers both admin and delegate authority to multisig
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, Wallet } = require('@project-serum/anchor');
const bs58 = require('bs58');
const fs = require('fs');
require('dotenv').config();

// Configuration
const SOLANA_MULTISIG = "GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh";
const OFT_STORE = "8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk";
const PROGRAM_ID = "FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL";
const ENDPOINT_PROGRAM = "76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6";

async function main() {
    console.log('🥊 FIGHT Token - Solana Admin Transfer');
    console.log('='.repeat(60));
    console.log('');
    
    try {
        // Setup connection
        const connection = new Connection(
            process.env.RPC_URL_SOLANA || 'https://mainnet.helius-rpc.com/?api-key=95cfe6ef-15ca-4074-b322-b319171315a9',
            'confirmed'
        );
        
        // Load wallet
        if (!process.env.SOLANA_PRIVATE_KEY) {
            throw new Error('SOLANA_PRIVATE_KEY not found in .env');
        }
        
        const wallet = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY));
        
        console.log('📋 Configuration:');
        console.log(`   OFT Store: ${OFT_STORE}`);
        console.log(`   Program ID: ${PROGRAM_ID}`);
        console.log(`   Current Admin: ${wallet.publicKey.toString()}`);
        console.log(`   Target Multisig: ${SOLANA_MULTISIG}`);
        console.log('');
        
        // Load IDL
        const idlPath = './target/idl/oft.json';
        if (!fs.existsSync(idlPath)) {
            throw new Error('IDL not found. Run: anchor build');
        }
        
        const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
        
        // Setup provider and program
        const provider = new AnchorProvider(connection, new Wallet(wallet), {
            commitment: 'confirmed'
        });
        const program = new Program(idl, new PublicKey(PROGRAM_ID), provider);
        
        // Fetch current OFT Store state
        console.log('🔍 Checking current admin...');
        const oftStore = await program.account.oftStore.fetch(new PublicKey(OFT_STORE));
        console.log(`   Current Admin: ${oftStore.admin.toString()}`);
        
        if (oftStore.admin.toString() === SOLANA_MULTISIG) {
            console.log('   ✅ Already set to multisig!');
            console.log('');
            console.log('Checking delegate...');
        } else {
            console.log('');
            console.log('⚠️  WARNING: Transferring admin to multisig!');
            console.log('   After this, only the multisig can:');
            console.log('   - Change admin');
            console.log('   - Set delegate');
            console.log('   - Configure fees');
            console.log('   - Set peers');
            console.log('');
            
            // Transfer Admin
            console.log('📝 Transferring admin...');
            const tx1 = await program.methods
                .setOftConfig({ admin: new PublicKey(SOLANA_MULTISIG) })
                .accounts({
                    admin: wallet.publicKey,
                    oftStore: new PublicKey(OFT_STORE),
                })
                .rpc();
            
            console.log(`   Transaction: ${tx1}`);
            console.log('   Waiting for confirmation...');
            await connection.confirmTransaction(tx1, 'confirmed');
            console.log('   ✅ Admin transferred!');
            console.log('');
        }
        
        // Get endpoint delegate account
        const [oappRegistry] = PublicKey.findProgramAddressSync(
            [Buffer.from("OAppRegistry"), new PublicKey(OFT_STORE).toBuffer()],
            new PublicKey(ENDPOINT_PROGRAM)
        );
        
        console.log('🔍 Checking LayerZero delegate...');
        console.log(`   OApp Registry: ${oappRegistry.toString()}`);
        
        // Note: After admin transfer, only multisig can set delegate
        const currentAdmin = oftStore.admin.toString();
        if (currentAdmin !== SOLANA_MULTISIG) {
            console.log('');
            console.log('📝 Setting LayerZero delegate...');
            
            const tx2 = await program.methods
                .setOftConfig({ delegate: new PublicKey(SOLANA_MULTISIG) })
                .accounts({
                    admin: wallet.publicKey,
                    oftStore: new PublicKey(OFT_STORE),
                })
                .remainingAccounts([
                    { pubkey: new PublicKey(ENDPOINT_PROGRAM), isSigner: false, isWritable: false },
                    { pubkey: oappRegistry, isSigner: false, isWritable: true },
                ])
                .rpc();
            
            console.log(`   Transaction: ${tx2}`);
            console.log('   Waiting for confirmation...');
            await connection.confirmTransaction(tx2, 'confirmed');
            console.log('   ✅ Delegate set!');
        } else {
            console.log('');
            console.log('⚠️  Admin already transferred.');
            console.log('   The multisig must now call setOftConfig to set delegate:');
            console.log('');
            console.log('   Use the multisig to execute:');
            console.log(`   program.methods.setOftConfig({ delegate: new PublicKey("${SOLANA_MULTISIG}") })`);
        }
        
        console.log('');
        console.log('='.repeat(60));
        console.log('✅ Solana Admin Transfer Complete!');
        console.log('='.repeat(60));
        console.log('');
        console.log('🔍 Verify with:');
        console.log(`   solana account ${OFT_STORE} --url mainnet-beta`);
        console.log('');
        console.log('⚠️  Remember: Also transfer program upgrade authority:');
        console.log(`   solana program set-upgrade-authority ${PROGRAM_ID} \\`);
        console.log(`     --new-upgrade-authority ${SOLANA_MULTISIG}`);
        console.log('');
        
    } catch (error) {
        console.error('');
        console.error('❌ Transfer failed!');
        console.error(`   Error: ${error.message}`);
        console.error('');
        
        if (error.toString().includes('Unauthorized')) {
            console.error('   You are not the current admin.');
        } else if (error.toString().includes('Account does not exist')) {
            console.error('   OFT Store account not found.');
            console.error('   Verify the OFT_STORE address is correct.');
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
