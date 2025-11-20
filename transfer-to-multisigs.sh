#!/bin/bash

# FIGHT Token - Transfer to Multisig Wallets
# Transfers admin/ownership to multisig on both chains

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_step() { echo -e "${BLUE}▶${NC} ${BOLD}$1${NC}"; }

echo "🥊 FIGHT Token - Transfer to Multisigs"
echo "========================================="
echo ""

# Configuration
SOLANA_PROGRAM_ID="FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL"
SOLANA_MULTISIG="GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh"
BSC_CONTRACT="0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab"
BSC_MULTISIG="0x1381c63F11Fe73998d80e2b42876C64362cF98Ab"

echo "📋 Configuration:"
echo "   Solana Program: $SOLANA_PROGRAM_ID"
echo "   Solana Multisig: $SOLANA_MULTISIG"
echo "   BSC Contract: $BSC_CONTRACT"
echo "   BSC Multisig: $BSC_MULTISIG"
echo ""
echo "Will transfer:"
echo ""
echo "   BSC:"
echo "     • Contract Ownership"
echo "     • LayerZero Delegate (requires multisig after)"
echo ""
echo "   Solana:"
echo "     • Program Upgrade Authority"
echo "     • OFT Admin (owner)"
echo "     • LayerZero Delegate"
echo ""

print_warning "⚠️  IMPORTANT: This will transfer ALL control to multisig wallets."
print_warning "   You will lose direct admin access after this."
echo ""
read -p "Type 'CONFIRM' to proceed: " confirmation

if [[ "$confirmation" != "CONFIRM" ]]; then
    print_error "Transfer cancelled"
    exit 1
fi

echo ""
echo "=================================================="
print_step "STEP 1: Transfer BSC Ownership & Delegate"
echo "=================================================="
echo ""

# Transfer BSC ownership
echo "Executing BSC ownership transfer..."
npx hardhat run scripts/transfer-bsc-to-multisig.js --network bsc-mainnet

if [ $? -eq 0 ]; then
    print_status "BSC ownership transferred successfully!"
else
    print_error "BSC ownership transfer failed"
    exit 1
fi

echo ""
echo "=================================================="
print_step "STEP 2: Transfer Solana Complete Control"
echo "=================================================="
echo ""

# Run complete Solana transfer (upgrade authority + admin + delegate)
./transfer-solana-complete.sh

if [ $? -eq 0 ]; then
    print_status "Solana transfers completed successfully!"
else
    print_error "Solana transfers failed"
    exit 1
fi

echo ""
echo "=================================================="
print_status "✅ ALL TRANSFERS COMPLETE!"
echo "=================================================="
echo ""
echo "📊 Summary:"
echo ""
echo "   BSC ($BSC_MULTISIG):"
echo "     ✅ Contract Ownership"
echo "     ⚠️  LayerZero Delegate (needs multisig action)"
echo ""
echo "   Solana ($SOLANA_MULTISIG):"
echo "     ✅ Program Upgrade Authority"
echo "     ✅ OFT Admin"
echo "     ✅ LayerZero Delegate"
echo ""
echo "🔍 Verify:"
echo "   BSC: https://bscscan.com/address/$BSC_CONTRACT#readContract"
echo "   Solana: npx hardhat lz:oft:solana:debug --eid 30168"
echo ""
echo "⚠️  BSC Action Required:"
echo "   The multisig must call setDelegate() on the BSC contract:"
echo "   contract.setDelegate(\"$BSC_MULTISIG\")"
echo ""
