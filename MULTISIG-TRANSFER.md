# FIGHT Token - Multisig Transfer Guide

## Overview
Transfer admin and upgrade authority from individual wallets to multisig wallets for enhanced security.

## Multisig Addresses
- **Solana**: `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`
- **BSC**: `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`

## Quick Start

### Option 1: Run Everything at Once
```bash
./transfer-to-multisigs.sh
```

### Option 2: Transfer Individually

#### BSC Contract Ownership
```bash
npx hardhat run scripts/transfer-bsc-to-multisig.js --network bsc-mainnet
```

#### Solana Program Upgrade Authority
```bash
solana program set-upgrade-authority FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL \
  --new-upgrade-authority GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh \
  --url https://mainnet.helius-rpc.com/?api-key=95cfe6ef-15ca-4074-b322-b319171315a9
```

## Pre-Transfer Checklist

- [ ] Confirm multisig wallet addresses are correct
- [ ] Verify you have the private keys/wallets with current admin rights
- [ ] Check BSC wallet has enough BNB for gas (~0.001 BNB)
- [ ] Ensure Solana wallet is set in `~/.config/solana/cli/config.yml`
- [ ] Test multisig functionality before transfer
- [ ] Have emergency recovery plan ready

## What Gets Transferred

### BSC (FightOFTSecondary)
- **Contract Ownership**: Only the multisig can call `onlyOwner` functions
- **Functions affected**:
  - `setPeer()` - Set cross-chain peers
  - `setEnforcedOptions()` - Set enforced options
  - `setDelegate()` - Set LayerZero delegate
  - `transferOwnership()` - Transfer ownership (requires multisig)

### Solana (OFT Program)
- **Upgrade Authority**: Only the multisig can upgrade the program
- **No more direct program upgrades** from individual wallet

## Verification

### BSC Contract
```bash
# Check owner
npx hardhat console --network bsc-mainnet
> const contract = await ethers.getContractAt("FightOFTSecondary", "0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab")
> await contract.owner()
# Should return: 0x1381c63F11Fe73998d80e2b42876C64362cF98Ab
```

Or visit: https://bscscan.com/address/0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab#readContract

### Solana Program
```bash
solana program show FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL
```

Look for:
```
Upgrade Authority: GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh
```

## Post-Transfer Actions

1. **Document the change**
   - Update your deployment documentation
   - Record transaction hashes
   - Update team access documentation

2. **Test multisig operations**
   - Test creating a multisig transaction
   - Test approving and executing a transaction
   - Verify all signers have access

3. **Update emergency procedures**
   - Document multisig recovery process
   - Update incident response procedures
   - Share multisig access with relevant team members

## Reverting (Emergency Only)

⚠️ **After transfer, only the MULTISIG can revert these changes!**

To revert BSC ownership:
```javascript
// Must be called BY the multisig
await contract.transferOwnership(NEW_OWNER_ADDRESS);
```

To revert Solana upgrade authority:
```bash
# Must be executed BY the multisig
solana program set-upgrade-authority PROGRAM_ID \
  --new-upgrade-authority NEW_AUTHORITY \
  --keypair multisig-keypair.json
```

## Troubleshooting

### BSC Transfer Fails
- **Error: "OwnableUnauthorizedAccount"**
  - You're not the current owner
  - Check `PRIVATE_KEY` in `.env` matches current owner

- **Error: "Insufficient funds"**
  - Add more BNB for gas fees
  - Try with higher gas price

### Solana Transfer Fails
- **Error: "Invalid authority"**
  - You're not the current upgrade authority
  - Check your Solana CLI config: `solana config get`
  - Set correct keypair: `solana config set --keypair /path/to/keypair.json`

- **Error: "Program not found"**
  - Check program ID is correct
  - Verify RPC URL is working

## Support

If you encounter issues:
1. Check the error messages carefully
2. Verify all addresses and keys are correct
3. Test on devnet/testnet first if unsure
4. Contact the development team

## Security Notes

- **Never share private keys**
- **Always verify addresses before transferring**
- **Test multisig functionality before production transfer**
- **Keep backup of all transaction hashes**
- **Document all multisig signers and their roles**
