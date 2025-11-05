const { ethers } = require('hardhat');

async function main() {
    console.log('🔍 CHECKING CORRECTED CONTRACT SUPPLY');
    console.log('====================================');
    console.log('');
    
    const contractAddress = '0xeBB1677084E249947475BfBc5442bFd41265eFa7';
    
    // Get the contract instance
    const FightOFT = await ethers.getContractFactory('FightOFTSecondary');
    const contract = FightOFT.attach(contractAddress);
    
    try {
        // Check total supply
        const totalSupply = await contract.totalSupply();
        console.log('📊 CONTRACT DETAILS:');
        console.log('• Address:', contractAddress);
        console.log('• Name:', await contract.name());
        console.log('• Symbol:', await contract.symbol());
        console.log('• Decimals:', await contract.decimals());
        console.log('• Total Supply:', ethers.utils.formatEther(totalSupply), 'FIGHT');
        console.log('• Supply Cap:', ethers.utils.formatEther(await contract.SUPPLY_CAP()), 'FIGHT');
        console.log('');
        
        // Check owner balance
        const owner = await contract.owner();
        const ownerBalance = await contract.balanceOf(owner);
        console.log('👤 OWNER DETAILS:');
        console.log('• Owner Address:', owner);
        console.log('• Owner Balance:', ethers.utils.formatEther(ownerBalance), 'FIGHT');
        console.log('');
        
        if (totalSupply.isZero()) {
            console.log('✅ SUCCESS: Contract has 0 initial supply as expected!');
            console.log('💡 Tokens will only exist when transferred from Solana');
        } else {
            console.log('❌ ERROR: Contract has unexpected initial supply!');
        }
        
        console.log('');
        console.log('🔗 View on BSCScan:');
        console.log(`   https://bscscan.com/address/${contractAddress}`);
        
    } catch (error) {
        console.error('❌ Error checking contract:', error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });