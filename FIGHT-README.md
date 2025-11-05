# 🥊 FIGHT Token - LayerZero OFT

<p align="center">
  <img src="https://assets.fight.foundation/FIGHT_Token_Icon/white_orange_bg/FightCoin1024.jpg" alt="FIGHT Token" width="200">
</p>

<p align="center">
  <strong>The official token of the Fight ecosystem — powering the digital economy of combat sports.</strong>
</p>

<p align="center">
  <a href="https://fight.id">🌐 Website</a> •
  <a href="https://x.com/JoinFightId">🐦 Twitter</a> •
  <a href="https://t.me/fightfiofficial">💬 Telegram</a> •
  <a href="https://discord.gg/fightid">💭 Discord</a>
</p>

## 📋 Token Information

| Property | Value |
|----------|-------|
| **Name** | FIGHT |
| **Symbol** | FIGHT |
| **Total Supply** | 10,000,000,000 |
| **Decimals** | 9 |
| **Token Type** | Omnichain Fungible Token (OFT) |
| **Chains** | Solana, BSC (Binance Smart Chain) |
| **Launch Date** | October 2025 |
| **Category** | Utility Token |

## 🎯 Description

$FIGHT enables access, rewards, and governance across Fight.ID, community programs, and partner platforms. Built on LayerZero's OFT standard, FIGHT tokens can seamlessly move between Solana and EVM chains while maintaining unified liquidity.

## 🚀 Quick Start

### Prerequisites

- **Rust** `v1.75.0`
- **Anchor** `v0.29` (for building)
- **Solana CLI** `v1.17.31` (for building) / `v1.18.26` (for deployment)
- **Docker** `v28.3.0+`
- **Node.js** `>=18.16.0`
- **pnpm** (recommended)

### Setup

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo>
   cd fight-token
   ./setup.sh
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your private keys and RPC endpoints
   ```

3. **Fund your Solana wallet:**
   ```bash
   solana airdrop 5 -u devnet
   ```

### Build and Deploy

1. **Generate program keypair:**
   ```bash
   anchor keys sync -p oft
   ```

2. **Build the Solana program:**
   ```bash
   # Use the deployment script for guidance
   ./deploy-fight.sh
   ```

3. **Deploy to Solana Devnet:**
   ```bash
   # Switch to deployment version
   sh -c "$(curl -sSfL https://release.anza.xyz/v1.18.26/install)"
   
   # Deploy with priority fee
   solana program deploy --program-id target/deploy/oft-keypair.json target/verifiable/oft.so -u devnet --with-compute-unit-price 1000
   
   # Switch back to build version
   sh -c "$(curl -sSfL https://release.anza.xyz/v1.17.31/install)"
   ```

4. **Create FIGHT token OFT Store:**
   ```bash
   pnpm hardhat lz:oft:solana:create \
     --eid 40168 \
     --program-id <YOUR_PROGRAM_ID> \
     --only-oft-store true \
     --amount 1000000000000000000 \
     --name "FIGHT" \
     --symbol "FIGHT" \
     --uri "https://assets.fight.foundation/fight_metadata_v1.json"
   ```

5. **Deploy EVM contracts:**
   ```bash
   pnpm hardhat lz:deploy
   ```

6. **Initialize and wire chains:**
   ```bash
   # Initialize Solana configs
   npx hardhat lz:oft:solana:init-config --oapp-config layerzero.config.ts
   
   # Wire the chains together
   pnpm hardhat lz:oapp:wire --oapp-config layerzero.config.ts
   ```

### Send Tokens Cross-Chain

**From Solana to BSC:**
```bash
npx hardhat lz:oft:send --src-eid 40168 --dst-eid 40102 --to <BSC_ADDRESS> --amount 1
```

**From BSC to Solana:**
```bash
npx hardhat lz:oft:send --src-eid 40102 --dst-eid 40168 --to <SOLANA_ADDRESS> --amount 1
```

## 📁 Project Structure

```
fight-token/
├── 🥊 fight-config.ts          # FIGHT token configuration
├── 🔧 setup.sh                 # Development setup script  
├── 🚀 deploy-fight.sh          # Deployment guide script
├── ⚙️ layerzero.config.ts      # LayerZero OFT configuration
├── 📄 contracts/               # EVM smart contracts
├── 🦀 programs/                # Solana programs
├── 🧪 test/                    # Test files
└── 📚 docs/                    # Documentation
```

## 🔧 Configuration

The FIGHT token is configured with the following parameters:

- **Only OFT Store Minting**: `true` (secure, only LayerZero can mint)
- **Shared Decimals**: `6` (LayerZero standard for cross-chain)
- **Local Decimals**: `9` (Solana standard)
- **Freeze Authority**: None (tokens cannot be frozen)
- **Initial Supply**: 1 billion tokens on Solana

## 🌐 Supported Chains

| Chain | Network | Endpoint ID | Status |
|-------|---------|-------------|---------|
| Solana | Devnet | 40168 | ✅ Supported |
| BSC | Testnet | 40102 | ✅ Supported |
| Arbitrum | Sepolia | 40231 | ✅ Supported |

## 🔒 Security Features

- ✅ **Immutable Mint Authority**: Only OFT Store can mint
- ✅ **No Freeze Authority**: Tokens cannot be frozen
- ✅ **LayerZero Security Stack**: DVN verification
- ✅ **Testnet Validation**: Thoroughly tested on testnets

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test Solana program
anchor test

# Test EVM contracts
npx hardhat test
```

## 📖 Resources

- [LayerZero OFT Documentation](https://docs.layerzero.network/v2/concepts/applications/oft-standard)
- [Solana Program Development](https://docs.solana.com/developing/programming-model/overview)
- [FIGHT Ecosystem](https://fight.id)

## 🐛 Troubleshooting

### Common Issues

1. **Build fails with Anchor version error**
   - Ensure you're using Anchor v0.29.0 exactly
   - Run: `cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked`

2. **Solana deployment fails**
   - Check your devnet SOL balance: `solana balance -u devnet`
   - Increase priority fee if network is congested

3. **Docker build issues**
   - Ensure Docker is running and up to date
   - Try: `docker system prune` to clean up

### Getting Help

- 🐛 [GitHub Issues](https://github.com/Fight-Foundation/fight-token/issues)
- 💬 [Telegram Community](https://t.me/fightfiofficial)  
- 💭 [Discord Server](https://discord.gg/fightid)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ by the Fight Foundation team</strong><br>
  <em>Powering the digital economy of combat sports</em>
</p>