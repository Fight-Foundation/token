const bs58 = require('bs58');
const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

const privateKeyBase58 = process.env.SOLANA_PRIVATE_KEY;
if (!privateKeyBase58) {
  console.error('SOLANA_PRIVATE_KEY not found in environment');
  process.exit(1);
}

const privateKeyBytes = bs58.default.decode(privateKeyBase58);
fs.writeFileSync('/tmp/solana-transfer-keypair.json', JSON.stringify(Array.from(privateKeyBytes)));
console.log('Keypair written to /tmp/solana-transfer-keypair.json');

const keypair = Keypair.fromSecretKey(privateKeyBytes);
console.log('Public key:', keypair.publicKey.toBase58());
