# FIGHT Token Production Deployment V2 - Status

**Date:** November 10, 2025  
**Status:** ⚠️ **PARTIAL - Awaiting Solana Deployment**

## Deployment Configuration

### Multisig Addresses
- **Solana Multisig:** `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`
- **BSC Multisig:** `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`

### Token Configuration
- **Name:** FIGHT
- **Symbol:** FIGHT
- **Total Supply:** 10,000,000,000 FIGHT
- **Decimals:** 9 (Solana), 18 (BSC - but uses Solana's shared decimals for cross-chain)
- **Shared Decimals:** 6 (for LayerZero cross-chain transfers)

---

## ✅ Completed Steps

### 1. ✅ BSC Deployment (COMPLETED)
**Contract:** `0x9a6442b7A9355E00c4ce7cD0be7e8a53FDf70100`  
**Network:** BSC Mainnet (EID: 30102)  
**Verified:** https://bscscan.com/address/0x9a6442b7A9355E00c4ce7cD0be7e8a53FDf70100#code

**Configuration:**
- LayerZero Endpoint: `0x1a44076050125825900e736c501f859c50fE728c`
- Delegate: `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab` (Multisig) ✓
- Initial Supply: 0 FIGHT (tokens come from Solana)
- Contract Type: FightOFTSecondary (no minting)

**Security:**
- ✅ Deployed with multisig as delegate
- ✅ Contract verified on BscScan
- ⚠️ Deployer still has OApp owner role (needs transfer in Step 5)

### 2. ✅ Code Modifications
- ✅ Added `--admin` parameter to `lz:oft:solana:create` task
- ✅ Updated BSC deployment script to use multisig delegate
- ✅ Created `deploy-production-v2.sh` comprehensive deployment script
- ✅ Fixed `setOftConfig.ts` task (added to tasks/index.ts)

---

## 🚧 Pending Steps

### 3. ⏳ Solana Program Deployment
**Status:** REQUIRES MANUAL ACTION

**Current Program ID:** Check with `anchor keys list | grep "oft:"`

**Actions Required:**
1. Build the program:
   ```bash
   cd /home/alex/fight-lzo
   anchor build -v -e OFT_ID=$(anchor keys list | grep "oft:" | awk '{print $2}')
   ```

2. Deploy to Solana Mainnet:
   ```bash
   solana program deploy \
     --program-id target/deploy/oft-keypair.json \
     target/verifiable/oft.so \
     -u mainnet-beta \
     --with-compute-unit-price 10000
   ```

### 4. ⏳ Create Solana OFT with Multisig Admin
**Status:** WAITING FOR STEP 3

**Command:**
```bash
pnpm hardhat lz:oft:solana:create \
  --eid 30168 \
  --program-id <PROGRAM_ID_FROM_STEP_3> \
  --admin GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh \
  --amount 10000000000000000000 \
  --name "FIGHT" \
  --symbol "FIGHT" \
  --uri "https://assets.fight.foundation/fight_metadata_v1.json" \
  --only-oft-store true
```

**Expected Output:**
- OFT Store Address
- Token Mint Address  
- 10B FIGHT minted to deployer
- Admin set to Solana multisig

### 5. ⏳ Transfer BSC Ownership
**Status:** WAITING FOR STEP 6 (requires wiring first)

The delegate is already set to multisig during deployment, but the OApp owner role needs to be transferred. This should be done after cross-chain wiring is configured.

### 6. ⏳ Configure Cross-Chain Wiring
**Status:** WAITING FOR STEP 4

**Commands:**
```bash
# Initialize Solana endpoint configuration
npx hardhat lz:oft:solana:init-config --oapp-config layerzero.config.ts

# Wire Solana ↔ BSC
pnpm hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

### 7. ⏳ Test Cross-Chain Transfer
**Status:** WAITING FOR STEP 6

**Test Plan:**
1. Transfer 1 FIGHT from Solana → BSC
2. Verify receipt on BSC
3. Transfer 1 FIGHT from BSC → Solana
4. Verify round-trip success

### 8. ⏳ Set Solana Update Authority
**Status:** WAITING FOR STEP 4

**Command:**
```bash
npx hardhat lz:oft:solana:set-update-authority \
  --eid 30168 \
  --mint <MINT_FROM_STEP_4> \
  --new-update-authority GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh
```

### 9. ⏳ Transfer Tokens to Solana Multisig
**Status:** WAITING FOR ALL PREVIOUS STEPS

**Command:**
```bash
spl-token transfer \
  --fund-recipient \
  <MINT_ADDRESS> \
  ALL \
  GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh
```

---

## Security Checklist

### Solana
- [ ] Admin set to multisig during creation
- [ ] Update Authority transferred to multisig
- [ ] All tokens transferred to multisig
- [ ] Deployer retains no admin capabilities

### BSC
- [x] Delegate set to multisig during deployment ✅
- [ ] Owner role transferred to multisig
- [ ] Contract verified on BscScan ✅
- [ ] No initial supply minted ✅

### Cross-Chain
- [ ] Peers configured (Solana ↔ BSC)
- [ ] Enforced options set correctly
- [ ] Test transfers completed successfully
- [ ] Rate limits configured (if needed)

---

## Important Notes

### ⚠️ Previous Deployment Issue
The original Solana OFT deployment on **November 10, 2025** had the admin accidentally set to `11111111111111111111111111111111` (System Program), which permanently renounced admin authority. This cannot be recovered.

**Old Deployment (DO NOT USE):**
- Program: `FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL`
- OFT Store: `HP4V8MwaMnjoJPm48XSbg8zuywBPdHXnrsnXoE69MrcH`
- Mint: `4CP46VS5mMyKqhC4nB6pFea3w3hhTnqtQoA2xdyVGcvu`
- **Status:** BRICKED - Admin authority lost

### ✅ This V2 Deployment
This new deployment properly sets the admin to the Squads multisig from the start, preventing the previous issue.

---

## Next Steps for Deployment

1. **IMMEDIATE:** Build and deploy Solana program (Step 3)
2. Create Solana OFT with multisig admin (Step 4)
3. Configure cross-chain wiring (Step 6)
4. Test 1 token transfer both ways (Step 7)
5. Transfer BSC ownership (Step 5)
6. Set Solana update authority (Step 8)
7. Transfer all tokens to multisig (Step 9)

---

## References

- **BSC Contract:** https://bscscan.com/address/0x9a6442b7A9355E00c4ce7cD0be7e8a53FDf70100#code
- **LayerZero Docs:** https://docs.layerzero.network/v2
- **Solana Explorer:** https://solscan.io/ (mainnet)
- **Squads Protocol:** https://squads.so/

---

*Last Updated: November 10, 2025*
