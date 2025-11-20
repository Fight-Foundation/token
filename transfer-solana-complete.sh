#!/bin/bash

# FIGHT Token - Complete Solana Admin Transfer
# Transfers ALL admin authorities to multisig:
# 1. Program Upgrade Authority
# 2. OFT Admin (owner)
# 3. LayerZero Delegate

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

echo "🥊 FIGHT Token - Complete Solana Admin Transfer"
echo "=================================================="
echo ""

# Configuration
PROGRAM_ID="FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL"
OFT_STORE="8TRG47KgD9KgZaHyKH5CKZRCAhfUAzbqivXV8SZWWhYk"
MULTISIG="GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh"
CURRENT_ADMIN="B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt"
RPC_URL="${RPC_URL_SOLANA:-https://mainnet.helius-rpc.com/?api-key=95cfe6ef-15ca-4074-b322-b319171315a9}"

echo "📋 Configuration:"
echo "   Program ID: $PROGRAM_ID"
echo "   OFT Store: $OFT_STORE"
echo "   Current Admin: $CURRENT_ADMIN"
echo "   Target Multisig: $MULTISIG"
echo ""
echo "Will transfer:"
echo "   1. Program Upgrade Authority"
echo "   2. OFT Admin (Owner)"
echo "   3. LayerZero Delegate"
echo ""

# Check current state
print_step "Checking current state..."
echo ""
npx hardhat lz:oft:solana:debug --eid 30168

echo ""
print_warning "⚠️  CRITICAL: This will transfer ALL control to the multisig."
print_warning "   After this, only the multisig can manage the program."
echo ""
read -p "Type 'TRANSFER' to continue: " confirmation

if [[ "$confirmation" != "TRANSFER" ]]; then
    print_error "Transfer cancelled"
    exit 1
fi

echo ""
echo "=================================================="
print_step "STEP 1: Transfer Program Upgrade Authority"
echo "=================================================="
echo ""

# Check if solana CLI is installed
if ! command -v solana &> /dev/null; then
    print_error "Solana CLI not found. Install it first:"
    echo "   sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    exit 1
fi

echo "Transferring program upgrade authority..."
solana program set-upgrade-authority $PROGRAM_ID \
    --new-upgrade-authority $MULTISIG \
    --url $RPC_URL

if [ $? -eq 0 ]; then
    print_status "Program upgrade authority transferred!"
    echo ""
    
    # Verify
    echo "Verifying..."
    NEW_AUTH=$(solana program show $PROGRAM_ID --url $RPC_URL | grep "Upgrade Authority" | awk '{print $3}')
    if [ "$NEW_AUTH" = "$MULTISIG" ]; then
        print_status "✅ Verified: $NEW_AUTH"
    else
        print_error "Verification failed! Got: $NEW_AUTH"
    fi
else
    print_error "Program upgrade authority transfer failed"
    exit 1
fi

echo ""
echo "=================================================="
print_step "STEP 2: Transfer OFT Admin & Delegate"
echo "=================================================="
echo ""

echo "Transferring OFT admin and delegate..."
node scripts/transfer-solana-admin.js

if [ $? -eq 0 ]; then
    print_status "OFT admin and delegate transferred!"
else
    print_error "OFT admin/delegate transfer failed"
    exit 1
fi

echo ""
echo "=================================================="
print_step "Verification"
echo "=================================================="
echo ""

echo "Running final verification..."
npx hardhat lz:oft:solana:debug --eid 30168

echo ""
echo "=================================================="
print_status "✅ ALL TRANSFERS COMPLETE!"
echo "=================================================="
echo ""
echo "📊 What was transferred:"
echo "   ✅ Program Upgrade Authority → $MULTISIG"
echo "   ✅ OFT Admin → $MULTISIG"
echo "   ✅ LayerZero Delegate → $MULTISIG"
echo ""
echo "🔒 Security Status:"
echo "   ✓ Only multisig can upgrade program"
echo "   ✓ Only multisig can change admin"
echo "   ✓ Only multisig can configure LayerZero"
echo "   ✓ Only multisig can set peers"
echo "   ✓ Only multisig can set fees"
echo ""
echo "📋 Next Steps:"
echo "   1. Test multisig operations"
echo "   2. Update team documentation"
echo "   3. Verify on Solana Explorer:"
echo "      https://explorer.solana.com/address/$OFT_STORE"
echo ""
