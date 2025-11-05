# 🚀 FIGHT Token Cross-Chain Testing Guide

This guide provides the **easiest ways** to test FIGHT token transfers between Solana and BSC.

## Quick Test Commands

### 1. 🌉 Solana → BSC Transfer
```bash
cd /home/alex/fight-token

# Test transfer of 1 FIGHT token from Solana to BSC
pnpm hardhat lz:oft:send \
  --network solana-mainnet \
  --src-eid 30168 \
  --dst-eid 30102 \
  --to 0x86675ac295c762DF18862BFC19980a73DB6fF8eC \
  --amount "1.0"
```

### 2. 🌉 BSC → Solana Transfer  
```bash
cd /home/alex/fight-token

# Test transfer of 1 FIGHT token from BSC to Solana
pnpm hardhat lz:oft:send \
  --network bsc-mainnet \
  --src-eid 30102 \
  --dst-eid 30168 \
  --to YOUR_SOLANA_WALLET_ADDRESS \
  --amount "1.0"
```

## Interactive Testing Script

For easier testing with prompts, run the interactive script:

```bash
cd /home/alex/fight-token
node scripts/interactive-test.js
```

This script provides a menu-driven interface for:
- ✅ Sending tokens Solana → BSC
- ✅ Sending tokens BSC → Solana  
- ✅ Checking configurations
- ✅ Checking balances

## Endpoint IDs
- **Solana Mainnet**: 30168
- **BSC Mainnet**: 30102

## Prerequisites for Testing

### For Solana → BSC:
1. **FIGHT tokens** in your Solana wallet
2. **SOL** for transaction fees
3. **Valid BSC recipient address** (0x format)

### For BSC → Solana:
1. **FIGHT tokens** in your BSC wallet  
2. **BNB** for transaction fees
3. **Valid Solana recipient address** (base58 format)

## Balance Checking

Check balances before and after transfers:
```bash
cd /home/alex/fight-token
pnpm hardhat run scripts/test-crosschain-transfer.js --network bsc-mainnet
```

## Example Test Flow

1. **Check initial balances**:
   ```bash
   pnpm hardhat run scripts/test-crosschain-transfer.js --network bsc-mainnet
   ```

2. **Send 1 FIGHT from Solana to BSC**:
   ```bash
   pnpm hardhat lz:oft:send --network solana-mainnet --src-eid 30168 --dst-eid 30102 --to YOUR_BSC_ADDRESS --amount "1.0"
   ```

3. **Wait 2-3 minutes** for cross-chain confirmation

4. **Check balances again** to see the transfer

5. **Send back from BSC to Solana**:
   ```bash
   pnpm hardhat lz:oft:send --network bsc-mainnet --src-eid 30102 --dst-eid 30168 --to YOUR_SOLANA_ADDRESS --amount "1.0"
   ```

## Configuration Verification

Verify your setup anytime:
```bash
cd /home/alex/fight-token
pnpm hardhat lz:oapp:config:get --oapp-config layerzero.config.ts
```

## Troubleshooting

### Common Issues:
- **Insufficient tokens**: Check you have FIGHT tokens in source wallet
- **Insufficient gas**: Ensure SOL/BNB for transaction fees  
- **Wrong address format**: Use 0x for BSC, base58 for Solana
- **Rate limits**: Wait between transfers if using rate-limited endpoints

### Getting Help:
```bash
# Get command help
pnpm hardhat help lz:oft:send

# Check available networks
pnpm hardhat help | grep network
```

---

**🎉 Your bridge is production-ready! Start with small test amounts and increase gradually.**