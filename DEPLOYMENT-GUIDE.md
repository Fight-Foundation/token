# 🥊 FIGHT Token Deployment Guide

This guide will walk you through deploying the FIGHT token as a LayerZero Omnichain Fungible Token (OFT) on both Solana and EVM chains.

## 🎯 Overview

The FIGHT token will be deployed as:
- **Solana**: Native SPL token with OFT capabilities (9 decimals)
- **EVM Chains**: ERC-20 token with OFT capabilities (18 decimals) 
- **Cross-chain**: Seamless transfers between chains via LayerZero

## 📋 Pre-Deployment Checklist

### ✅ Requirements Met
- [ ] Rust v1.75.0 installed
- [ ] Anchor v0.29.0 installed  
- [ ] Solana CLI v1.17.31 installed
- [ ] Docker running
- [ ] Node.js >=18.16.0 installed
- [ ] pnpm installed

### ✅ Environment Setup
- [ ] `.env` file configured with private keys
- [ ] Solana wallet funded (minimum 5 SOL on devnet)
- [ ] EVM wallet funded (gas tokens on target chains)

### ✅ Network Configuration
- [ ] Solana Devnet: 40168
- [ ] BSC Testnet: 40102 (or your preferred EVM testnet)

## 🚀 Deployment Steps

### Step 1: Prepare Solana Program

```bash
# Generate the OFT program keypair
anchor keys sync -p oft

# View the generated program ID
anchor keys list
# Copy the 'oft' program ID for the next step
```

### Step 2: Build Solana Program

```bash
# Build with your specific program ID
anchor build -v -e OFT_ID=<YOUR_PROGRAM_ID>

# Check estimated costs
PROGRAM_SIZE=$(wc -c < target/verifiable/oft.so)
echo "Program size: $PROGRAM_SIZE bytes"
solana rent $PROGRAM_SIZE -u devnet
```

### Step 3: Deploy Solana Program

```bash
# Switch to deployment version for better experience
sh -c "$(curl -sSfL https://release.anza.xyz/v1.18.26/install)"

# Deploy with priority fee (adjust fee based on network congestion)
solana program deploy \
  --program-id target/deploy/oft-keypair.json \
  target/verifiable/oft.so \
  -u devnet \
  --with-compute-unit-price 1000

# Switch back to build version
sh -c "$(curl -sSfL https://release.anza.xyz/v1.17.31/install)"
```

### Step 4: Create FIGHT Token on Solana

```bash
# Create the FIGHT token with initial supply
pnpm hardhat lz:oft:solana:create \
  --eid 40168 \
  --program-id <YOUR_PROGRAM_ID> \
  --only-oft-store true \
  --amount 1000000000000000000 \
  --name "FIGHT" \
  --symbol "FIGHT" \
  --uri "https://assets.fight.foundation/fight_metadata_v1.json" \
  --local-decimals 9 \
  --shared-decimals 6
```

### Step 5: Deploy EVM Contracts

```bash
# Deploy to your target EVM chain (BSC Testnet, Arbitrum Sepolia, etc.)
pnpm hardhat lz:deploy
# Follow the prompts to select FightOFT contract
```

### Step 6: Initialize Cross-Chain Configuration

```bash
# Initialize Solana pathway configurations
npx hardhat lz:oft:solana:init-config --oapp-config layerzero.config.ts

# Wire all chains together
pnpm hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

## 🧪 Testing Cross-Chain Transfers

### Solana → EVM

```bash
# Send 1 FIGHT from Solana to BSC
npx hardhat lz:oft:send \
  --src-eid 40168 \
  --dst-eid 40102 \
  --to <BSC_ADDRESS> \
  --amount 1
```

### EVM → Solana

```bash
# Send 1 FIGHT from BSC to Solana  
npx hardhat lz:oft:send \
  --src-eid 40102 \
  --dst-eid 40168 \
  --to <SOLANA_ADDRESS> \
  --amount 1
```

## 📊 Post-Deployment Verification

### Verify Solana Deployment

```bash
# Check OFT Store info
npx hardhat lz:oft:solana:debug --eid 40168

# Verify token metadata
spl-token display <TOKEN_MINT> -u devnet

# Check initial supply
spl-token supply <TOKEN_MINT> -u devnet
```

### Verify EVM Deployment

```bash
# Check contract deployment
npx hardhat verify --network <NETWORK_NAME> <CONTRACT_ADDRESS>

# Verify token details using Hardhat console
npx hardhat console --network <NETWORK_NAME>
# Then in console:
# const contract = await ethers.getContract("FightOFT")
# await contract.name()          // Should return "FIGHT"
# await contract.symbol()        // Should return "FIGHT" 
# await contract.totalSupply()   // Should return 10000000000000000000000000000
```

## 🔧 Configuration Details

### FIGHT Token Parameters

| Property | Solana Value | EVM Value |
|----------|--------------|-----------|
| Name | FIGHT | FIGHT |
| Symbol | FIGHT | FIGHT |
| Decimals | 9 | 18 |
| Total Supply | 10,000,000,000 | 10,000,000,000 |
| Initial Mint | 1,000,000,000 | 10,000,000,000 |
| Mint Authority | OFT Store Only | Contract Owner |

### LayerZero Configuration

- **Shared Decimals**: 6 (for cross-chain compatibility)
- **DVN**: LayerZero Labs (default)
- **Confirmations**: 15 (Solana) / 32 (EVM)
- **Gas Limits**: 200,000 CU (Solana) / 80,000 gas (EVM)

## 🚨 Production Checklist

Before mainnet deployment:

- [ ] Replace `MyOFTMock` with `FightOFT` in all configurations
- [ ] Use multisig wallets for contract ownership
- [ ] Test all cross-chain pathways thoroughly
- [ ] Verify all contract addresses and program IDs
- [ ] Set appropriate gas limits and DVN configurations
- [ ] Enable security monitoring and alerts

## 🆘 Troubleshooting

### Common Issues

**Build Fails**
- Ensure Docker is running
- Check Anchor version: `anchor --version` should be 0.29.0
- Check Solana CLI version: `solana --version` should be 1.17.31

**Deployment Fails**  
- Check SOL balance: `solana balance -u devnet`
- Increase priority fee if network congested
- Verify program ID matches Anchor.toml

**Wiring Fails**
- Ensure both chains are deployed successfully  
- Check LayerZero endpoint addresses
- Verify contract ownership

### Getting Help

- 🐛 **GitHub Issues**: For technical problems
- 💬 **Telegram**: https://t.me/fightfiofficial  
- 💭 **Discord**: https://discord.gg/fightid
- 📖 **Docs**: https://docs.layerzero.network/

## ✅ Success!

Once deployed successfully, you should have:

1. **Solana FIGHT Token**: Native SPL token with LayerZero OFT capabilities
2. **EVM FIGHT Token**: ERC-20 token with LayerZero OFT capabilities  
3. **Cross-Chain Bridge**: Seamless transfers between all supported chains
4. **Unified Liquidity**: Single token ecosystem across multiple blockchains

🥊 **Welcome to the Fight ecosystem!** Your FIGHT tokens are now ready to power the digital economy of combat sports across multiple blockchains.

---

*Built with ❤️ by the Fight Foundation team*