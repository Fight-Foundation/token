# 🥊 FIGHT Token Mainnet Production Deployment

> **⚠️ WARNING: This guide is for MAINNET deployment with REAL funds!**
> 
> Ensure you have thoroughly tested on testnets and have all necessary funds before proceeding.

## 📋 Pre-Deployment Requirements

### 💰 Required Funds
- **Solana Mainnet**: Minimum 5 SOL
  - ~4 SOL for program deployment rent
  - ~1 SOL for transactions and account creation
- **BSC Mainnet**: Minimum 0.1 BNB
  - For contract deployment gas fees
  - For ongoing transaction costs

### 🔐 Security Prerequisites
- [ ] Private keys stored securely (hardware wallet recommended)
- [ ] Backup of all seed phrases/private keys
- [ ] Multisig wallets prepared for ongoing operations
- [ ] Emergency procedures documented

### ✅ Technical Prerequisites
- [ ] Successful testnet deployment completed
- [ ] All dependencies installed (Rust, Anchor, Solana CLI, Node.js)
- [ ] Docker running
- [ ] Environment variables configured

## 🚀 Mainnet Deployment Process

### Step 1: Environment Setup

Update your `.env` file with mainnet RPC URLs:

```bash
# Production Solana Mainnet RPC 
RPC_URL_SOLANA=https://api.mainnet-beta.solana.com

# BSC Mainnet RPC URL
RPC_URL_BSC_MAINNET=https://bsc-dataseed.binance.org/

# Your production private keys (keep secure!)
SOLANA_PRIVATE_KEY=your_solana_private_key
PRIVATE_KEY=0xyour_evm_private_key
```

### Step 2: Generate and Build Program

```bash
# Generate program keypair
anchor keys sync -p oft

# Note your program ID
anchor keys list
# Save the 'oft' program ID - you'll need it

# Build for mainnet (ensure Solana v1.17.31 & Anchor v0.29.0)
anchor build -v -e OFT_ID=<YOUR_PROGRAM_ID>
```

### Step 3: Deploy Solana Program to Mainnet

```bash
# Switch to deployment version
sh -c "$(curl -sSfL https://release.anza.xyz/v1.18.26/install)"

# Deploy to mainnet with priority fee
solana program deploy \
  --program-id target/deploy/oft-keypair.json \
  target/verifiable/oft.so \
  --url mainnet-beta \
  --with-compute-unit-price 10000

# Switch back to build version  
sh -c "$(curl -sSfL https://release.anza.xyz/v1.17.31/install)"
```

### Step 4: Create FIGHT Token on Solana Mainnet

```bash
# Create FIGHT token with 1B initial supply
pnpm hardhat lz:oft:solana:create \
  --eid 30168 \
  --program-id <YOUR_PROGRAM_ID> \
  --only-oft-store true \
  --amount 1000000000000000000 \
  --name "FIGHT" \
  --symbol "FIGHT" \
  --uri "https://assets.fight.foundation/fight_metadata_v1.json" \
  --local-decimals 9 \
  --shared-decimals 6
```

### Step 5: Deploy to BSC Mainnet

```bash
# Deploy FightOFT contract to BSC mainnet
pnpm hardhat lz:deploy --network bsc-mainnet
# Select 'FightOFT' when prompted
```

### Step 6: Initialize Cross-Chain Configuration

```bash
# Initialize pathway configurations
npx hardhat lz:oft:solana:init-config --oapp-config layerzero.config.ts

# Wire the chains together
pnpm hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

## 🧪 Testing Cross-Chain Transfers

### Test Small Amounts First!

```bash
# Send 0.1 FIGHT from Solana to BSC
npx hardhat lz:oft:send \
  --src-eid 30168 \
  --dst-eid 30102 \
  --to <BSC_ADDRESS> \
  --amount 0.1

# Send 0.1 FIGHT from BSC to Solana
npx hardhat lz:oft:send \
  --src-eid 30102 \
  --dst-eid 30168 \
  --to <SOLANA_ADDRESS> \
  --amount 0.1
```

## 📊 Network Details

| Network | Chain ID | Endpoint ID | RPC URL |
|---------|----------|-------------|---------|
| Solana Mainnet | N/A | 30168 | https://api.mainnet-beta.solana.com |
| BSC Mainnet | 56 | 30102 | https://bsc-dataseed.binance.org/ |

## 🔐 Security Best Practices

### Immediate Actions After Deployment

1. **Transfer Ownership to Multisig**
   ```bash
   # For BSC contract - transfer ownership to multisig
   # Use appropriate multisig solution (Safe, Gnosis, etc.)
   ```

2. **Set Up Monitoring**
   - Monitor cross-chain transfers
   - Set up alerts for unusual activity
   - Track token supply across chains

3. **Backup Critical Information**
   - Program ID and deployment addresses
   - Transaction hashes for all deployments
   - Multisig wallet addresses and signers

### Ongoing Security

- Use hardware wallets for all operations
- Implement time-locks for critical operations
- Regular security audits
- Monitor for smart contract vulnerabilities

## 📈 Post-Deployment Checklist

### Contract Verification
- [ ] Verify BSC contract on BSCScan
- [ ] Submit token metadata to CoinGecko/CoinMarketCap
- [ ] Update official documentation with addresses

### Community & Marketing
- [ ] Announce mainnet launch
- [ ] Provide contract addresses to community
- [ ] Update website with mainnet information
- [ ] Begin token distribution activities

### Technical Monitoring
- [ ] Set up block explorer monitoring
- [ ] Configure cross-chain transfer tracking
- [ ] Monitor gas fees and optimize if needed
- [ ] Test all functionality with small amounts

## 🆘 Emergency Procedures

### If Something Goes Wrong

1. **Stop All Operations**
   - Pause token transfers if possible
   - Communicate with community immediately

2. **Assess the Situation**
   - Determine scope of the issue
   - Check all transaction histories
   - Verify contract states

3. **Get Help**
   - Contact LayerZero support: [Discord](https://discord.gg/layerzero)
   - Reach out to security experts
   - Consider emergency upgrades if applicable

## 💡 Production Tips

### Gas Optimization
- Use priority fees during high congestion
- Batch operations when possible
- Monitor network conditions before large operations

### User Experience
- Provide clear instructions for cross-chain transfers
- Set up user-friendly interfaces
- Document common issues and solutions

### Compliance
- Understand regulatory requirements in target jurisdictions
- Implement necessary compliance measures
- Keep detailed records of all operations

---

## 🥊 Ready for Launch!

Once you've completed all steps and verified everything works correctly, your FIGHT token will be live on mainnet and ready to power the digital economy of combat sports across Solana and BSC!

**Remember**: Start with small test transactions before enabling large-scale operations.

---

*Built with ❤️ by the Fight Foundation team*
*For support: https://discord.gg/fightid*