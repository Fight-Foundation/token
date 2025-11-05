#!/usr/bin/env node
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Configuration
const SOLANA_TOKEN = '4CP46VS5mMyKqhC4nB6pFea3w3hhTnqtQoA2xdyVGcvu';
const BSC_CONTRACT = '0xeBB1677084E249947475BfBc5442bFd41265eFa7';

console.log('🚀 FIGHT Token Cross-Chain Transfer Tester');
console.log('==========================================');
console.log(`Solana Token: ${SOLANA_TOKEN}`);
console.log(`BSC Contract: ${BSC_CONTRACT}`);
console.log('');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

function runCommand(command, description) {
    console.log(`\n🔄 ${description}`);
    console.log(`Running: ${command}`);
    console.log('-'.repeat(60));
    
    try {
        const output = execSync(command, { 
            stdio: 'inherit',
            cwd: '/home/alex/fight-token'
        });
        console.log('✅ Command completed successfully');
        return true;
    } catch (error) {
        console.error('❌ Command failed:', error.message);
        return false;
    }
}

async function main() {
    while (true) {
        console.log('\n📋 Available Actions:');
        console.log('1. Send FIGHT: Solana → BSC');
        console.log('2. Send FIGHT: BSC → Solana'); 
        console.log('3. Check OFT configuration');
        console.log('4. Check balances (via test script)');
        console.log('5. Exit');
        
        const choice = await askQuestion('\nSelect an action (1-5): ');
        
        switch (choice) {
            case '1':
                console.log('\n🌉 Solana → BSC Transfer');
                const bscRecipient = await askQuestion('Enter BSC recipient address: ');
                const solanaSendAmount = await askQuestion('Enter amount to send (in wei/smallest unit): ');
                
                const solanaCommand = `pnpm hardhat lz:oft:send --network solana-mainnet --dst-eid 30102 --to ${bscRecipient} --amount ${solanaSendAmount}`;
                runCommand(solanaCommand, 'Sending FIGHT tokens from Solana to BSC');
                break;
                
            case '2':
                console.log('\n🌉 BSC → Solana Transfer');
                const solanaRecipient = await askQuestion('Enter Solana recipient address: ');
                const bscSendAmount = await askQuestion('Enter amount to send (in wei/smallest unit): ');
                
                const bscCommand = `pnpm hardhat lz:oft:send --network bsc-mainnet --dst-eid 30168 --to ${solanaRecipient} --amount ${bscSendAmount}`;
                runCommand(bscCommand, 'Sending FIGHT tokens from BSC to Solana');
                break;
                
            case '3':
                const configCommand = `pnpm hardhat lz:oapp:config:get --oapp-config layerzero.config.ts`;
                runCommand(configCommand, 'Checking OFT configuration');
                break;
                
            case '4':
                const testCommand = `pnpm hardhat run scripts/test-crosschain-transfer.js --network bsc-mainnet`;
                runCommand(testCommand, 'Checking contract balances');
                break;
                
            case '5':
                console.log('\n👋 Goodbye!');
                rl.close();
                return;
                
            default:
                console.log('❌ Invalid choice. Please select 1-5.');
        }
        
        const continueChoice = await askQuestion('\nPress Enter to continue...');
    }
}

main().catch(console.error);