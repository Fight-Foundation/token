# FIGHT Token - Technical Overview

## Overview

FIGHT is a cross-chain fungible token deployed on Solana and BNB Smart Chain (BSC), utilizing LayerZero V2 protocol for seamless cross-chain transfers. The token implements the Omnichain Fungible Token (OFT) standard, ensuring secure and efficient bridging between chains.

---

## Token Specifications

### Solana (Primary Chain)
- **Token Type:** SPL Token (Native)
- **Token Mint:** `8f62NyJGo7He5uWeveTA2JJQf4xzf8aqxkmzxRQ3mxfU`
- **Total Supply:** 10,000,000,000 FIGHT (10 billion)
- **Decimals:** 9
- **Token Standard:** SPL Token with Metaplex metadata

### BNB Smart Chain (Secondary Chain)
- **Token Type:** ERC-20 (OFT)
- **Contract Address:** `0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab`
- **Supply Model:** Wrapped (no native minting, all tokens bridged from Solana)
- **Decimals:** 18
- **Token Standard:** LayerZero OFT V2

---

## Architecture

### Cross-Chain Bridge (LayerZero V2)

FIGHT utilizes LayerZero's Omnichain Fungible Token (OFT) protocol for trustless cross-chain transfers:

**Solana Components:**
- **OFT Program:** `FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL`
- **OFT Store:** `8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk`
- **Token Escrow:** `6rZoHSARsboMx1vNesfqd7q1DasgxWs5yivrRJvKaSPe`
- **LayerZero Endpoint:** `76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6`
- **Endpoint ID:** 30168 (Solana Mainnet)

**BSC Components:**
- **OFT Contract:** `0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab`
- **LayerZero Endpoint:** `0x1a44076050125825900e736c501f859c50fE728c`
- **Endpoint ID:** 30102 (BSC Mainnet)

### Bridge Mechanism

1. **Solana → BSC:**
   - Tokens are locked in the Solana escrow account
   - LayerZero message is sent to BSC
   - Equivalent tokens are minted on BSC

2. **BSC → Solana:**
   - Tokens are burned on BSC
   - LayerZero message is sent to Solana
   - Equivalent tokens are released from escrow on Solana

---

## Governance & Security

### Multi-Signature Wallets

FIGHT token implements multi-signature governance for enhanced security and decentralization:

#### Solana Multisig (Squads V4)
- **Address:** `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh`
- **Type:** Squads V4 Vault
- **Controls:**
  - ✅ OFT Admin (program configuration)
  - ✅ Token Metadata Update Authority
  - ⚠️ LayerZero Delegate (pending multisig action)
  - ⚠️ Program Upgrade Authority (pending transfer)

#### BSC Multisig
- **Address:** `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab`
- **Controls:**
  - ✅ Contract Ownership
  - ⚠️ LayerZero Delegate (pending multisig action)

### Security Features

1. **Decentralized Control:** All critical functions require multi-signature approval
2. **Upgrade Protection:** Program/contract upgrades require multisig consensus
3. **Rate Limiting:** Built-in rate limits for cross-chain transfers
4. **DVN Security:** LayerZero V2 uses Decentralized Verifier Networks (DVNs) for message verification
5. **Immutable Mint Authority:** Solana token mint authority is controlled by OFT Store (no additional minting possible)

---

## Token Distribution

### Initial Supply
- **Total Minted:** 10,000,000,000 FIGHT (on Solana)
- **Circulating (Solana):** Variable based on bridge activity
- **Bridged (BSC):** Dynamic based on user bridge transfers

### Current Holdings
- **Multisig Treasury:** 10,000,000,000 FIGHT
  - Transaction: `5AGrL5Rm8sQQJnbVHYUVUAJZcYqJcEgNnyhkFiSXuXPy7iKfnMM28YjoPBEGESgHnNd5HvbbXzdJbkRhSy3aXVt6`

---

## Technical Details

### Solana Program

**Program Type:** Anchor-based Rust program  
**Program ID:** `FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL`

**Key Instructions:**
- `send`: Initiate cross-chain transfer to BSC
- `lz_receive`: Receive tokens from BSC
- `set_oft_config`: Configure admin/delegate (multisig only)

**OFT Store Configuration:**
- **Type:** Native OFT (uses existing SPL token)
- **Admin:** Multisig (controls configuration)
- **Delegate:** Controls LayerZero endpoint settings
- **Token Mint Authority:** OFT Store PDA (prevents additional minting)

### BSC Smart Contract

**Contract Type:** Solidity ERC-20 + LayerZero OFT  
**Address:** `0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab`

**Key Functions:**
- `send()`: Bridge tokens to Solana
- `_lzReceive()`: Receive tokens from Solana
- `transferOwnership()`: Transfer ownership (multisig only)
- `setDelegate()`: Set LayerZero delegate (multisig only)

**Supply Cap:** 10,000,000,000 FIGHT (enforced at contract level)

---

## Deployment Information

### Deployment Dates
- **Solana Program:** Deployed at slot 376682336
- **BSC Contract:** Deployed November 2025

### Deployment Transactions

**Solana:**
- Program Deployment: Slot 376682336
- OFT Store Creation: On-chain
- Token Transfer to Multisig: `5AGrL5Rm8sQQJnbVHYUVUAJZcYqJcEgNnyhkFiSXuXPy7iKfnMM28YjoPBEGESgHnNd5HvbbXzdJbkRhSy3aXVt6`

**BSC:**
- Contract Deployment: TBD
- Ownership Transfer: `0xa3f30a326d76c93bd872e501b69aa2a9e67867adc084bb3b38d1ca898c124124` (Block 67808442)

---

## Verification & Auditing

### On-Chain Verification

**Solana:**
- Program deployed and verifiable on-chain
- Source code: https://github.com/Fight-Foundation/token

**BSC:**
- Contract verified on BscScan
- Verification: https://bscscan.com/address/0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab

### Security Measures

1. **Multi-Signature Requirements:**
   - All administrative actions require multisig approval
   - Upgrade authority controlled by multisig
   - Delegate configuration controlled by multisig

2. **LayerZero V2 Security:**
   - Decentralized Verifier Networks (DVNs)
   - Message authentication and verification
   - Configurable security parameters

3. **Supply Controls:**
   - Fixed maximum supply (10B tokens)
   - No minting capability on BSC (wrapped only)
   - Mint authority on Solana held by OFT Store PDA

---

## Integration Guide

### Adding FIGHT to Wallets

**Solana Wallets (Phantom, Solflare, etc.):**
```
Token Address: 8f62NyJGo7He5uWeveTA2JJQf4xzf8aqxkmzxRQ3mxfU
```

**BSC Wallets (MetaMask, Trust Wallet, etc.):**
```
Contract Address: 0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab
Token Symbol: FIGHT
Decimals: 18
```

### Bridging Tokens

Users can bridge FIGHT tokens between Solana and BSC using LayerZero-compatible interfaces or direct contract interaction.

**Important:** Bridge fees apply for cross-chain transfers (paid in native gas token: SOL or BNB).

---

## Explorer Links

### Solana
- **Token Mint:** https://explorer.solana.com/address/8f62NyJGo7He5uWeveTA2JJQf4xzf8aqxkmzxRQ3mxfU
- **OFT Program:** https://explorer.solana.com/address/FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL
- **OFT Store:** https://explorer.solana.com/address/8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk
- **Multisig:** https://explorer.solana.com/address/GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh
- **Squads App:** https://v4.squads.so/

### BSC
- **Contract:** https://bscscan.com/address/0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab
- **Multisig:** https://bscscan.com/address/0x1381c63F11Fe73998d80e2b42876C64362cF98Ab
- **Ownership Transfer TX:** https://bscscan.com/tx/0xa3f30a326d76c93bd872e501b69aa2a9e67867adc084bb3b38d1ca898c124124

### LayerZero
- **LayerZero Scan:** https://layerzeroscan.com/
- **Solana Endpoint:** https://layerzeroscan.com/endpoint/30168
- **BSC Endpoint:** https://layerzeroscan.com/endpoint/30102

---

## Repository & Source Code

- **GitHub:** https://github.com/Fight-Foundation/token
- **License:** MIT
- **Documentation:** Available in repository

---

## Support & Contact

For technical inquiries, integration support, or security concerns:

- **GitHub Issues:** https://github.com/Fight-Foundation/token/issues
- **Documentation:** Repository README.md

---

## Appendix: Complete Address Reference

### Solana Addresses
| Component | Address |
|-----------|---------|
| Token Mint | `8f62NyJGo7He5uWeveTA2JJQf4xzf8aqxkmzxRQ3mxfU` |
| OFT Program | `FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL` |
| OFT Store | `8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk` |
| Token Escrow | `6rZoHSARsboMx1vNesfqd7q1DasgxWs5yivrRJvKaSPe` |
| LayerZero Endpoint | `76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6` |
| Multisig (Squads V4) | `GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh` |
| Multisig Token Account | `HFzqZ8c7pRstrYe9dzk9mZZP7wA2c86p7m5L73o6bsk7` |

### BSC Addresses
| Component | Address |
|-----------|---------|
| FIGHT OFT Contract | `0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab` |
| LayerZero Endpoint | `0x1a44076050125825900e736c501f859c50fE728c` |
| Multisig | `0x1381c63F11Fe73998d80e2b42876C64362cF98Ab` |

### LayerZero Endpoint IDs
| Chain | Endpoint ID |
|-------|-------------|
| Solana Mainnet | 30168 |
| BSC Mainnet | 30102 |

---

**Document Version:** 1.0  
**Last Updated:** November 11, 2025  
**Status:** Production Deployment Active
