const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, transfer, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const { getSolanaKeypair } = require('@layerzerolabs/devtools-solana');

async function main() {
    const mintAddress = new PublicKey('E6vA3gd7ACf2wYDKYWRPWbvMew62kKAWTyJW6zArmXCs');
    const recipientAddress = new PublicKey('GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh');
    const amount = BigInt(10_000_000_000); // 10B tokens with 9 decimals
    
    console.log('Transferring all tokens to multisig...');
    console.log(`Mint: ${mintAddress.toBase58()}`);
    console.log(`Recipient: ${recipientAddress.toBase58()}`);
    console.log(`Amount: ${amount.toString()} (10 billion tokens)`);
    
    // Get keypair from env
    const keypair = await getSolanaKeypair();
    console.log(`Sender: ${keypair.publicKey.toBase58()}`);
    
    // Connect to mainnet
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    
    // Get or create associated token accounts
    console.log('\nGetting token accounts...');
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        mintAddress,
        keypair.publicKey
    );
    console.log(`From account: ${fromTokenAccount.address.toBase58()}`);
    
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        mintAddress,
        recipientAddress
    );
    console.log(`To account: ${toTokenAccount.address.toBase58()}`);
    
    // Transfer tokens
    console.log('\nTransferring tokens...');
    const signature = await transfer(
        connection,
        keypair,
        fromTokenAccount.address,
        toTokenAccount.address,
        keypair.publicKey,
        amount
    );
    
    console.log(`✅ Transfer complete!`);
    console.log(`Signature: ${signature}`);
    console.log(`Transaction: https://solscan.io/tx/${signature}?cluster=mainnet-beta`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
