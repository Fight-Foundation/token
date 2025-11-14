const anchor = require('@coral-xyz/anchor');
const { PublicKey, SystemProgram } = require('@solana/web3.js');

// Configuration
const PROGRAM_ID = new PublicKey('FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL');
const OFT_STORE = new PublicKey('8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk');
const ENDPOINT = new PublicKey('76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6');
const NEW_DELEGATE = new PublicKey('GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh');
const CURRENT_ADMIN = new PublicKey('GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh'); // Multisig

console.log('🔧 Generating Squads Transaction Data for Delegate Transfer\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Calculate OApp Config PDA
const [oappConfigPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('OAppConfig'), OFT_STORE.toBuffer()],
  ENDPOINT
);

console.log('📋 Transaction Details:\n');
console.log('Program ID:', PROGRAM_ID.toBase58());
console.log('Instruction: SetOftConfig');
console.log('\n📊 Accounts:');
console.log('  1. admin (signer, writable):', CURRENT_ADMIN.toBase58());
console.log('  2. oft_store (writable):', OFT_STORE.toBase58());
console.log('  3. oapp_config:', oappConfigPda.toBase58());
console.log('  4. endpoint_program:', ENDPOINT.toBase58());
console.log('\n🎯 Parameter:');
console.log('  SetOFTConfigParams::Delegate');
console.log('  New Delegate:', NEW_DELEGATE.toBase58());

// Create instruction data
// Instruction discriminator for SetOftConfig (8 bytes)
const discriminator = Buffer.from([
  0xd1, 0x4b, 0x71, 0x4e, 0x5e, 0x39, 0x3f, 0x38
]);

// Enum variant for Delegate (1 byte: 0x01) + Pubkey (32 bytes)
const variant = Buffer.from([0x01]); // Delegate variant
const delegatePubkey = NEW_DELEGATE.toBuffer();

const instructionData = Buffer.concat([discriminator, variant, delegatePubkey]);

console.log('\n📦 Instruction Data (base58):');
console.log(anchor.utils.bytes.bs58.encode(instructionData));

console.log('\n📦 Instruction Data (hex):');
console.log(instructionData.toString('hex'));

console.log('\n📦 Instruction Data (array):');
console.log('[' + Array.from(instructionData).join(', ') + ']');

console.log('\n\n🔗 For Squads V4:\n');
console.log('1. Go to: https://v4.squads.so/');
console.log('2. Select your vault:', CURRENT_ADMIN.toBase58());
console.log('3. Create new transaction proposal');
console.log('4. Add instruction with:');
console.log('   ├─ Program ID:', PROGRAM_ID.toBase58());
console.log('   ├─ Accounts (in order):');
console.log('   │  ├─ [0] Signer, Writable:', CURRENT_ADMIN.toBase58());
console.log('   │  ├─ [1] Writable:', OFT_STORE.toBase58());
console.log('   │  ├─ [2] Read-only:', oappConfigPda.toBase58());
console.log('   │  └─ [3] Read-only:', ENDPOINT.toBase58());
console.log('   └─ Data (hex):', instructionData.toString('hex'));
console.log('\n5. Submit proposal for multisig approval');

console.log('\n\n📝 Alternative: Use Squads CLI (if available):\n');
console.log(`squads-cli proposal create \\
  --vault ${CURRENT_ADMIN.toBase58()} \\
  --program ${PROGRAM_ID.toBase58()} \\
  --data ${instructionData.toString('hex')}`);

console.log('\n\n✅ Transaction data generated successfully!\n');
