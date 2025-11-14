const { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
require('dotenv').config();

async function transferUpgradeAuthority() {
  // Configuration
  const PROGRAM_ID = 'FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL';
  const NEW_AUTHORITY = 'GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh';
  const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  
  console.log('🔄 Transferring program upgrade authority...');
  console.log('Program:', PROGRAM_ID);
  console.log('New Authority:', NEW_AUTHORITY);
  console.log('RPC:', RPC_URL);
  
  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');
  
  // Load current authority keypair
  const privateKeyBase58 = process.env.SOLANA_PRIVATE_KEY;
  if (!privateKeyBase58) {
    throw new Error('SOLANA_PRIVATE_KEY not found in .env');
  }
  
  const privateKeyBytes = bs58.decode(privateKeyBase58);
  const currentAuthority = Keypair.fromSecretKey(privateKeyBytes);
  console.log('Current Authority:', currentAuthority.publicKey.toBase58());
  
  // Get program account to find the programdata account
  const programId = new PublicKey(PROGRAM_ID);
  const programInfo = await connection.getAccountInfo(programId);
  
  if (!programInfo) {
    throw new Error('Program account not found');
  }
  
  // For BPF Upgradeable Loader programs, the program account contains the programdata address
  // The programdata account is at offset 4 in the program account data
  const programDataAddress = new PublicKey(programInfo.data.slice(4, 36));
  console.log('Program Data Address:', programDataAddress.toBase58());
  
  // Verify current authority
  const programDataInfo = await connection.getAccountInfo(programDataAddress);
  if (!programDataInfo) {
    throw new Error('Program data account not found');
  }
  
  // The upgrade authority is stored at offset 13 in the programdata account
  const currentAuthorityInData = new PublicKey(programDataInfo.data.slice(13, 45));
  console.log('Current Authority in Data:', currentAuthorityInData.toBase58());
  
  if (!currentAuthorityInData.equals(currentAuthority.publicKey)) {
    throw new Error(`Current authority mismatch. Expected ${currentAuthority.publicKey.toBase58()}, found ${currentAuthorityInData.toBase58()}`);
  }
  
  // Create the SetAuthority instruction for BPF Upgradeable Loader
  const BPF_UPGRADEABLE_LOADER = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');
  const newAuthority = new PublicKey(NEW_AUTHORITY);
  
  // SetAuthority instruction data: [4, 0, 0, 0] for SetAuthority with new authority
  const instructionData = Buffer.alloc(5);
  instructionData.writeUInt8(4, 0); // SetAuthority instruction index
  instructionData.writeUInt8(1, 1); // Option::Some
  
  const instruction = {
    keys: [
      { pubkey: programDataAddress, isSigner: false, isWritable: true },
      { pubkey: currentAuthority.publicKey, isSigner: true, isWritable: false },
      { pubkey: newAuthority, isSigner: false, isWritable: false },
    ],
    programId: BPF_UPGRADEABLE_LOADER,
    data: instructionData,
  };
  
  console.log('\n📝 Creating transaction...');
  const transaction = new Transaction().add(instruction);
  
  // Get recent blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = currentAuthority.publicKey;
  
  console.log('📡 Sending transaction...');
  try {
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [currentAuthority],
      {
        commitment: 'confirmed',
        skipPreflight: false,
      }
    );
    
    console.log('\n✅ Upgrade authority transferred successfully!');
    console.log('Transaction signature:', signature);
    console.log('Explorer:', `https://solscan.io/tx/${signature}`);
    
    // Verify the change
    const updatedProgramDataInfo = await connection.getAccountInfo(programDataAddress);
    const updatedAuthority = new PublicKey(updatedProgramDataInfo.data.slice(13, 45));
    console.log('\n🔍 Verification:');
    console.log('New Authority:', updatedAuthority.toBase58());
    
    if (updatedAuthority.equals(newAuthority)) {
      console.log('✅ Authority verified successfully!');
    } else {
      console.log('⚠️ Warning: Authority verification failed');
    }
    
  } catch (error) {
    console.error('\n❌ Transaction failed:');
    console.error(error);
    throw error;
  }
}

transferUpgradeAuthority().catch(console.error);
