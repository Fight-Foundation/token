# FIGHT Token Production Deployment - FINAL

**Date:** November 11, 2025  
**Status:** ✅ **DEPLOYED & CONFIGURED - Ready for Multisig Transfer**

---

## 🎯 Deployment Summary

### Solana Mainnet (EID: 30168)
- **Program ID:** `FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL`
- **Token Mint:** `AmPaDQR5pogezB2d6zUw9oH9LAEM1DuhqSC8Bn8SCS6X`
- **OFT Store:** `AuvRdb63gvPfaY9KzRZo78EMBHMWSZs4sY1H9npWwKEC`
- **Token Escrow:** `5XzietqTzKXMfFSf7aTVcDZCq5TanPYR5X8uSsoYGhqX`
- **Total Supply:** 10,000,000,000 FIGHT (10B tokens)
- **Decimals:** 9
- **Current Admin:** `B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt` (EOA - deployer)
- **Current Delegate:** `B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt` (EOA - deployer)
- **Update Authority:** `B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt` (EOA - deployer)
- **Explorer:** https://solscan.io/token/AmPaDQR5pogezB2d6zUw9oH9LAEM1DuhqSC8Bn8SCS6X

### BSC Mainnet (EID: 30102)
- **Contract:** `0xBBA2117B21BCf8F67b1A83c60EeD01ae8528B063`
- **Verified:** https://bscscan.com/address/0xBBA2117B21BCf8F67b1A83c60EeD01ae8528B063#code
- **LayerZero Endpoint:** `0x1a44076050125825900e736c501f859c50fE728c`
- **Current Owner:** `0xd05eD14Ce1c8b34f256abF4225a9B977f5Bf4072` (EOA - deployer)
- **Current Delegate:** `0xd05eD14Ce1c8b34f256abF4225a9B977f5Bf4072` (EOA - deployer)
- **Initial Supply:** 0 FIGHT (tokens come from Solana)

### Cross-Chain Configuration
- ✅ Peers set (Solana ↔ BSC)
- ✅ Send/Receive libraries configured
- ✅ Enforced options set
- ✅ DVN (Decentralized Verifier Network) configuration complete
- ✅ Executor settings configured

---

## 📋 Completed Steps

1. ✅ **Solana Program Deployed** - Program already deployed to mainnet
2. ✅ **Solana OFT Created** - 10B tokens minted with EOA admin
3. ✅ **BSC Contract Deployed** - FightOFTSecondary with EOA owner
4. ✅ **BSC Contract Verified** - Source code verified on BscScan
5. ✅ **Solana Config Initialized** - Endpoint configuration set
6. ✅ **Cross-Chain Wired** - Solana ↔ BSC pathways established

---

## ⏭️ Remaining Steps

### Step 1: Test Cross-Chain Transfers ⚠️ IMPORTANT

Test with small amounts before transferring control to multisigs:

```bash
# Test 1: Send 1 FIGHT from Solana → BSC
cd /home/alex/fight-lzo

# Check current Solana balance
spl-token balance AmPaDQR5pogezB2d6zUw9oH9LAEM1DuhqSC8Bn8SCS6X -u mainnet-beta

# Send 1 token to BSC (your EOA address)
npx hardhat lz:oft:solana:send \
  --eid 30168 \
  --oft-store AuvRdb63gvPfaY9KzRZo78EMBHMWSZs4sY1H9npWwKEC \
  --dst-eid 30102 \
  --amount 1000000000 \
  --to 0xd05eD14Ce1c8b34f256abF4225a9B977f5Bf4072

# Wait ~2-5 minutes for LayerZero to relay the message

# Check BSC balance
cast call 0xBBA2117B21BCf8F67b1A83c60EeD01ae8528B063 \
  "balanceOf(address)(uint256)" \
  0xd05eD14Ce1c8b34f256abF4225a9B977f5Bf4072 \
  --rpc-url https://bsc-dataseed.binance.org/

# Test 2: Send back from BSC → Solana (if Test 1 succeeds)
npx hardhat lz:oft:send \
  --network bsc-mainnet \
  --dst-eid 30168 \
  --amount 1 \
  --to $(solana address)
```

### Step 2: Transfer Solana Admin to Multisig

```bash
npx hardhat lz:oft:solana:set-oft-config \
  --eid 30168 \
  --admin GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh
```

**Verify:**
```bash
npx hardhat lz:oft:solana:debug --eid 30168
# Should show Admin: GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh
```

### Step 3: Transfer Solana Update Authority to Multisig

```bash
npx hardhat lz:oft:solana:set-update-authority \
  --eid 30168 \
  --mint AmPaDQR5pogezB2d6zUw9oH9LAEM1DuhqSC8Bn8SCS6X \
  --new-update-authority GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh
```

### Step 4: Transfer BSC Owner to Multisig

```bash
# Transfer ownership
npx hardhat run scripts/transfer-ownership.js --network bsc-mainnet

# OR use cast
cast send 0xBBA2117B21BCf8F67b1A83c60EeD01ae8528B063 \
  "transferOwnership(address)" \
  0x1381c63F11Fe73998d80e2b42876C64362cF98Ab \
  --rpc-url https://bsc-dataseed.binance.org/ \
  --private-key $PRIVATE_KEY
```

**Verify:**
```bash
cast call 0xBBA2117B21BCf8F67b1A83c60EeD01ae8528B063 \
  "owner()(address)" \
  --rpc-url https://bsc-dataseed.binance.org/
# Should return: 0x1381c63F11Fe73998d80e2b42876C64362cF98Ab
```

### Step 5: Transfer All Tokens to Solana Multisig

```bash
spl-token transfer \
  --fund-recipient \
  AmPaDQR5pogezB2d6zUw9oH9LAEM1DuhqSC8Bn8SCS6X \
  ALL \
  GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh \
  -u mainnet-beta
```

**Verify:**
```bash
spl-token balance AmPaDQR5pogezB2d6zUw9oH9LAEM1DuhqSC8Bn8SCS6X \
  --owner GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh \
  -u mainnet-beta
# Should show: 10000000000 (10B tokens)
```

---

## 🔒 Security Checklist

### Before Multisig Transfer
- [x] Solana program deployed
- [x] Solana OFT created with 10B supply
- [x] BSC contract deployed
- [x] BSC contract verified on BscScan
- [x] Cross-chain wiring configured
- [ ] **Cross-chain transfers tested successfully** ⚠️
- [ ] Round-trip transfer verified (Solana → BSC → Solana)

### After Multisig Transfer
- [ ] Solana Admin transferred to `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`
- [ ] Solana Update Authority transferred to multisig
- [ ] BSC Owner transferred to `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`
- [ ] All 10B tokens in Solana multisig wallet
- [ ] EOA has no admin/owner privileges
- [ ] Test small transfer from multisig to verify control

---

## 🎯 Multisig Addresses

### Solana Multisig (Squads V4)
**Address:** `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`  
**Purpose:** 
- Admin of OFT Store
- Delegate for LayerZero endpoint
- Update Authority for token metadata
- Holder of all 10B FIGHT tokens

**Squads UI:** https://v4.squads.so/

### BSC Multisig
**Address:** `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`  
**Purpose:**
- Owner of FightOFTSecondary contract
- Delegate for LayerZero endpoint

---

## 📊 Token Economics

- **Total Supply:** 10,000,000,000 FIGHT (Fixed)
- **Mint Authority:** OFT Store (locked - can only mint when receiving from BSC)
- **Freeze Authority:** None (renounced)
- **Cross-Chain:** Tokens can flow freely between Solana ↔ BSC
- **Burn Mechanism:** Tokens burn on source chain when sent cross-chain
- **Mint Mechanism:** Equivalent tokens mint on destination chain

---

## 🚨 Important Notes

### Admin Control
Once admin is transferred to multisigs, **all configuration changes require multisig approval:**
- Solana: Changes require Squads multisig transaction
- BSC: Changes require Safe/Gnosis multisig transaction

### Emergency Contacts
- **Deployer EOA (Solana):** `B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt`
- **Deployer EOA (BSC):** `0xd05eD14Ce1c8b34f256abF4225a9B977f5Bf4072`

### LayerZero Configuration
- **Confirmations (Solana → BSC):** 15 blocks
- **Confirmations (BSC → Solana):** 20 blocks
- **Required DVNs:** 3 (4VDjp..., F7gu..., GPjy...)
- **Optional DVNs:** 1 (HR9N...)
- **Executor Gas Limit:** 80,000 (BSC), 200,000 CU (Solana)

---

## 📚 References

- **LayerZero Docs:** https://docs.layerzero.network/v2
- **Squads Protocol:** https://squads.so/
- **Solana Explorer:** https://solscan.io/
- **BSC Explorer:** https://bscscan.com/
- **Project Repo:** https://github.com/Fight-Foundation/token

---

## 🔧 Troubleshooting

### Cross-Chain Transfer Fails
1. Check gas/SOL balances
2. Verify LayerZero pathway is set correctly
3. Check DVN configuration
4. Monitor LayerZero Scan: https://layerzeroscan.com/

### Cannot Transfer Admin/Owner
- Ensure current admin/owner is signing the transaction
- After transfer to multisig, use multisig UI to propose transactions

### Token Balance Mismatch
- Remember: Total supply is fixed at 10B
- BSC balance + Solana balance should always equal 10B
- Tokens are burned on source and minted on destination

---

*Deployment completed on November 11, 2025*  
*Last updated: November 11, 2025*
