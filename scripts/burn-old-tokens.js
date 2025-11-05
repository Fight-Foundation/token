const { ethers } = require('hardhat');

async function main() {
    console.log('🔥 BURNING ALL FIGHT TOKENS FROM OLD CONTRACT');
    console.log('==============================================');
    console.log('');
    
    const oldContractAddress = '0x86675ac295c762DF18862BFC19980a73DB6fF8eC';
    
    console.log('📍 Old Contract Address:', oldContractAddress);
    console.log('🎯 Action: Burn all tokens to zero supply');
    console.log('');
    
    // Get the contract instance using the original FightOFT
    const FightOFT = await ethers.getContractFactory('FightOFT');
    const contract = FightOFT.attach(oldContractAddress);
    
    // Get signer (owner)
    const [signer] = await ethers.getSigners();
    console.log('👤 Signer Address:', signer.address);
    
    try {
        // Check current state
        const totalSupply = await contract.totalSupply();
        const ownerBalance = await contract.balanceOf(signer.address);
        
        console.log('📊 CURRENT STATE:');
        console.log('• Total Supply:', ethers.utils.formatEther(totalSupply), 'FIGHT');
        console.log('• Owner Balance:', ethers.utils.formatEther(ownerBalance), 'FIGHT');
        console.log('');
        
        if (ownerBalance.isZero()) {
            console.log('✅ No tokens to burn - balance is already 0');
            return;
        }
        
        console.log('🔥 Burning all tokens...');
        
        // Burn all tokens by transferring to zero address
        const burnTx = await contract.transfer(
            '0x000000000000000000000000000000000000dEaD', // Burn address
            ownerBalance,
            {
                gasLimit: 100000 // Conservative gas limit
            }
        );
        
        console.log('⏳ Transaction submitted:', burnTx.hash);
        console.log('⏳ Waiting for confirmation...');
        
        const receipt = await burnTx.wait();
        
        console.log('✅ Tokens burned successfully!');
        console.log('📍 Transaction Hash:', receipt.transactionHash);
        console.log('⛽ Gas Used:', receipt.gasUsed.toString());
        console.log('');
        
        // Check final state
        const finalTotalSupply = await contract.totalSupply();
        const finalOwnerBalance = await contract.balanceOf(signer.address);
        const deadBalance = await contract.balanceOf('0x000000000000000000000000000000000000dEaD');
        
        console.log('📊 FINAL STATE:');
        console.log('• Total Supply:', ethers.utils.formatEther(finalTotalSupply), 'FIGHT');
        console.log('• Owner Balance:', ethers.utils.formatEther(finalOwnerBalance), 'FIGHT');
        console.log('• Dead Address Balance:', ethers.utils.formatEther(deadBalance), 'FIGHT');
        console.log('');
        
        console.log('🔗 View transaction on BSCScan:');
        console.log(`   https://bscscan.com/tx/${receipt.transactionHash}`);
        console.log('🔗 View old contract on BSCScan:');
        console.log(`   https://bscscan.com/address/${oldContractAddress}`);
        
    } catch (error) {
        console.error('❌ Error burning tokens:', error.message);
        
        // Additional error details
        if (error.reason) {
            console.error('   Reason:', error.reason);
        }
        if (error.code) {
            console.error('   Code:', error.code);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });