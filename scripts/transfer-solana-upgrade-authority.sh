#!/bin/bash

# Transfer Solana Program Upgrade Authority to Multisig
# This script transfers the program upgrade authority to a multisig wallet

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }

echo "🥊 FIGHT Token - Transfer Solana Upgrade Authority"
echo "======================================================"
echo ""

# Configuration
PROGRAM_ID="FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL"
MULTISIG="GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh"
RPC_URL="${RPC_URL_SOLANA:-https://mainnet.helius-rpc.com/?api-key=95cfe6ef-15ca-4074-b322-b319171315a9}"

echo "📋 Configuration:"
echo "   Program ID: $PROGRAM_ID"
echo "   New Authority (Multisig): $MULTISIG"
echo "   RPC URL: $RPC_URL"
echo ""

# Check if solana CLI is installed
if ! command -v solana &> /dev/null; then
    print_error "Solana CLI not found. Please install it first:"
    echo "   sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    exit 1
fi

print_status "Solana CLI found: $(solana --version)"
echo ""

# Check current authority
echo "🔍 Checking current program authority..."
CURRENT_AUTHORITY=$(solana program show $PROGRAM_ID --url $RPC_URL | grep "ProgramData Address" | awk '{print $3}')

if [ -z "$CURRENT_AUTHORITY" ]; then
    print_error "Could not fetch program authority"
    exit 1
fi

echo "   Program Data Account: $CURRENT_AUTHORITY"
echo ""

# Get upgrade authority
UPGRADE_AUTH=$(solana program show $PROGRAM_ID --url $RPC_URL | grep "Upgrade Authority" | awk '{print $3}')
echo "   Current Upgrade Authority: $UPGRADE_AUTH"
echo ""

if [ "$UPGRADE_AUTH" = "$MULTISIG" ]; then
    print_status "✅ Already transferred to multisig!"
    exit 0
fi

# Confirm transfer
print_warning "⚠️  IMPORTANT: This will transfer upgrade authority to the multisig."
print_warning "   After this, only the multisig can upgrade the program."
echo ""
read -p "Type 'TRANSFER' to continue: " confirmation

if [ "$confirmation" != "TRANSFER" ]; then
    print_error "Transfer cancelled"
    exit 1
fi

echo ""
print_info "Executing transfer..."

# Transfer upgrade authority
solana program set-upgrade-authority $PROGRAM_ID \
    --new-upgrade-authority $MULTISIG \
    --url $RPC_URL

if [ $? -eq 0 ]; then
    echo ""
    print_status "✅ Upgrade authority transferred successfully!"
    echo ""
    
    # Verify
    echo "🔍 Verifying transfer..."
    NEW_AUTH=$(solana program show $PROGRAM_ID --url $RPC_URL | grep "Upgrade Authority" | awk '{print $3}')
    echo "   New Upgrade Authority: $NEW_AUTH"
    
    if [ "$NEW_AUTH" = "$MULTISIG" ]; then
        print_status "✅ Verification successful!"
    else
        print_error "Verification failed! Expected $MULTISIG but got $NEW_AUTH"
        exit 1
    fi
else
    print_error "Transfer failed"
    exit 1
fi

echo ""
echo "======================================================"
print_status "All done! Program upgrade authority is now controlled by the multisig."
echo "======================================================"
