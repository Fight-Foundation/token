const fs = require('fs');
const bs58 = require('bs58');

const privateKeyBase58 = process.env.SOLANA_PRIVATE_KEY;
if (!privateKeyBase58) {
  console.error('SOLANA_PRIVATE_KEY not set');
  process.exit(1);
}

const privateKeyBytes = bs58.default.decode(privateKeyBase58);
fs.writeFileSync('/tmp/solana-keypair.json', JSON.stringify(Array.from(privateKeyBytes)));
console.log('Keypair written to /tmp/solana-keypair.json');
