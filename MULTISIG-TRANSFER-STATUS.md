# FIGHT Token - Multisig Transfer Summary
**Date:** November 11, 2025  
**Status:** PARTIALLY COMPLETE ⚠️

---

## 🎯 Objective
Transfer all administrative controls for FIGHT token from individual wallet to multisig wallets on both BSC and Solana chains.

---

## 📊 Current Status

### BSC (BNB Smart Chain)
**Contract:** `0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab`  
**Multisig:** `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`

| Authority | Status | Current Holder | Notes |
|-----------|--------|----------------|-------|
| **Contract Owner** | ✅ **TRANSFERRED** | `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab` | Transaction confirmed |
| **LayerZero Delegate** | ⚠️ **PENDING** | Unknown | Requires multisig action |

**BSC Transfer Transaction:**
- Hash: `0xa3f30a326d76c93bd872e501b69aa2a9e67867adc084bb3b38d1ca898c124124`
- Block: `67808442`
- Status: ✅ Confirmed on-chain

---

### Solana
**Program:** `FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL`  
**OFT Store:** `8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk`  
**Token Mint:** `8f62NyJGo7He5uWeveTA2JJQf4xzf8aqxkmzxRQ3mxfU`  
**Multisig:** `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh` (Squads V4 Vault)

| Authority | Status | Current Holder | Notes |
|-----------|--------|----------------|-------|
| **Program Upgrade Authority** | ❌ **NOT TRANSFERRED** | `B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt` | Critical - needs transfer |
| **OFT Admin (Owner)** | ✅ **TRANSFERRED** | `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh` | Successfully transferred |
| **SPL Token Update Authority** | ✅ **TRANSFERRED** | `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh` | Metadata authority transferred |
| **LayerZero Delegate** | ⚠️ **REQUIRES MULTISIG** | `B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt` | Must be set by multisig (admin changed) |

**Solana Verification:**
- Admin is confirmed as Squads V4 Vault: ✅ YES
- Token Mint Authority is OFT Store: ✅ YES
- Delegate is still old wallet: ⚠️ NEEDS TRANSFER

---

## ✅ Completed Actions

### BSC
1. ✅ Transferred contract ownership to multisig `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`
   - Command: `node scripts/transfer-bsc-to-multisig.js`
   - Result: Owner successfully changed
   - Verification: Confirmed via `contract.owner()` call

### Solana
1. ✅ Transferred OFT Admin to multisig
   - Command: `npx hardhat lz:oft:solana:set-oft-config --eid 30168 --admin GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`
   - Result: Admin now set to Squads V4 multisig
   
2. ✅ Transferred SPL Token Metadata Update Authority
   - Command: `npx hardhat lz:oft:solana:set-update-authority --eid 30168 --mint 8f62NyJGo7He5uWeveTA2JJQf4xzf8aqxkmzxRQ3mxfU --new-update-authority GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`
   - Result: Update authority transferred to multisig

---

## ⚠️ Pending Actions

### HIGH PRIORITY - Solana

#### 1. Transfer Program Upgrade Authority (CRITICAL)
**Current:** `B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt`  
**Target:** `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`

**Command to run:**
```bash
node scripts/transfer-upgrade-authority.js
```

**Why critical:** Program upgrade authority controls who can deploy new versions of the smart contract. This is the most sensitive permission.

**Fallback command (if script fails):**
```bash
solana program set-upgrade-authority FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL \
  --new-upgrade-authority GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh
```

#### 2. Transfer LayerZero Delegate (REQUIRES MULTISIG ACTION)
**Current:** `B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt`  
**Target:** `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`

**⚠️ IMPORTANT:** Since the OFT Admin is now the multisig, only the multisig can change the delegate.

**Action required:** The Solana multisig (via Squads V4) must create a proposal to call:
- Program: `FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL`
- Instruction: `SetOFTConfig`
- Parameter: `Delegate(GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh)`

### REQUIRES MULTISIG ACTION - BSC

#### 3. Set LayerZero Delegate (Requires Multisig Action)
**Current:** Unknown  
**Target:** `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`

**Action required:** The BSC multisig must call:
```solidity
FightOFTSecondary(0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab).setDelegate(0x1381c63F11Fe73998d80e2b42876C64362cF98Ab)
```

**Note:** This can only be done by the multisig since it's now the owner.

---

## 🔧 How to Complete Remaining Transfers

### Option 1: Run Individual Commands
```bash
# 1. Transfer Solana program upgrade authority
node scripts/transfer-upgrade-authority.js

# 2. Transfer Solana LayerZero delegate
npx hardhat lz:oft:solana:set-oft-config --eid 30168 --delegate GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh

# 3. Verify all transfers
npx hardhat lz:oft:solana:debug --eid 30168
npx hardhat run scripts/check-bsc-status.js --network bsc-mainnet
```

### Option 2: Update and Run Main Script
The `transfer-to-multisigs.sh` script needs to be updated with the working commands, then run:
```bash
./transfer-to-multisigs.sh
```

---

## 🔍 Verification Commands

### Check BSC Status
```bash
npx hardhat run scripts/check-bsc-status.js --network bsc-mainnet
```

### Check Solana Status
```bash
npx hardhat lz:oft:solana:debug --eid 30168
```

### Check Solana Program Authority
```bash
solana program show FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL
```

---

## 📋 Post-Transfer Actions (After ALL transfers complete)

### Immediate
1. ✅ Verify all authorities are set to multisig addresses
2. ✅ Test multisig can execute basic operations
3. ✅ Document multisig signing procedures
4. ✅ Backup all transaction signatures

### BSC Multisig Must Do
1. Call `setDelegate(0x1381c63F11Fe73998d80e2b42876C64362cF98Ab)` on the contract
2. Verify delegate was set correctly
3. Test LayerZero configuration changes

### Within 7 Days
1. Update team documentation with new multisig procedures
2. Train team members on multisig operations
3. Test emergency procedures
4. Update monitoring/alerting systems

---

## 🔐 Security Status

### What's Secured (✅)
- **BSC:** Contract ownership (multisig controls everything)
- **Solana:** OFT admin (multisig controls OFT configuration)
- **Solana:** Token metadata (multisig controls token info updates)

### What's NOT Secured Yet (❌)
- **Solana:** Program upgrade authority (⚠️ CRITICAL)
- **Solana:** LayerZero delegate
- **BSC:** LayerZero delegate (requires multisig action)

---

## 📞 Support Information

### Multisig Addresses
- **BSC:** `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`
- **Solana:** `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh` (Squads V4)

### Contract Addresses
- **BSC:** `0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab` (FightOFTSecondary)
- **Solana Program:** `FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL`
- **Solana OFT Store:** `8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk`
- **Solana Token Mint:** `8f62NyJGo7He5uWeveTA2JJQf4xzf8aqxkmzxRQ3mxfU`

### Explorer Links
- **BSC Contract:** https://bscscan.com/address/0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab
- **BSC Transfer Tx:** https://bscscan.com/tx/0xa3f30a326d76c93bd872e501b69aa2a9e67867adc084bb3b38d1ca898c124124
- **Solana Program:** https://explorer.solana.com/address/FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL
- **Solana OFT Store:** https://explorer.solana.com/address/8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk

---

## 📝 Notes

1. **Squads V4 Detection:** The Solana admin is confirmed as a Squads V4 vault, which provides additional security through multi-signature governance.

2. **Delegate vs Owner:** The delegate is NOT yet transferred but the admin/owner IS transferred. The delegate controls LayerZero configuration while the admin controls the OFT itself.

3. **BSC Ownership Complete:** BSC ownership transfer is 100% complete. Only the delegate (a LayerZero-specific setting) remains, which must be done by the multisig.

4. **Critical Priority:** The Solana program upgrade authority is the most critical remaining item - it should be transferred ASAP.

---

**Generated:** November 11, 2025  
**Last Updated:** After BSC ownership and Solana admin/update authority transfers
