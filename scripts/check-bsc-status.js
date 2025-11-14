const { ethers } = require('hardhat');

async function main() {
  const CONTRACT_ADDRESS = '0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab';
  const MULTISIG = '0x1381c63F11Fe73998d80e2b42876C64362cF98Ab';
  
  console.log('🔍 Checking BSC Contract Status...\n');
  console.log('Contract:', CONTRACT_ADDRESS);
  console.log('Expected Multisig:', MULTISIG);
  console.log('');
  
  const contract = await ethers.getContractAt('FightOFTSecondary', CONTRACT_ADDRESS);
  
  const owner = await contract.owner();
  
  console.log('Current Status:');
  console.log('  Owner:', owner);
  console.log('');
  
  const ownerIsMultisig = owner.toLowerCase() === MULTISIG.toLowerCase();
  
  console.log('Transfer Status:');
  console.log('  Owner transferred:', ownerIsMultisig ? '✅ YES' : '❌ NO');
  console.log('');
  
  if (ownerIsMultisig) {
    console.log('✅ BSC ownership transferred to multisig!');
    console.log('');
    console.log('📋 Next step for multisig:');
    console.log('   Call setDelegate(0x1381c63F11Fe73998d80e2b42876C64362cF98Ab)');
    console.log('   This sets the LayerZero delegate to the multisig');
  } else {
    console.log('❌ Owner transfer incomplete');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
