#!/bin/bash

# FIGHT Token Production Deployment Script - MAINNET
# ⚠️  WARNING: This deploys to PRODUCTION networks with REAL funds!

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_bold() {
    echo -e "${BOLD}$1${NC}"
}

echo "🥊 FIGHT Token Production Deployment - MAINNET"
echo "=============================================="
print_error "⚠️  WARNING: This will deploy to PRODUCTION networks!"
print_error "⚠️  Real funds will be used. Ensure you have:"
echo "   • Sufficient SOL on Solana mainnet (minimum 5 SOL)"
echo "   • Sufficient BNB on BSC mainnet for gas fees"
echo "   • Verified all configurations and tested on testnet first"
echo ""

read -p "Are you absolutely sure you want to proceed with MAINNET deployment? (type 'YES' to continue): " confirmation
if [[ "$confirmation" != "YES" ]]; then
    print_error "Deployment cancelled. Good choice to double-check!"
    exit 1
fi

echo ""
print_bold "🔐 PRODUCTION CHECKLIST"
echo "======================="

# Check if .env exists and has required variables
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create it with production keys."
    exit 1
fi

# Check for required environment variables
if ! grep -q "SOLANA_PRIVATE_KEY.*[A-Za-z0-9]" .env; then
    print_error "SOLANA_PRIVATE_KEY not set in .env"
    exit 1
fi

if ! grep -q "PRIVATE_KEY.*0x[A-Za-z0-9]" .env; then
    print_error "EVM PRIVATE_KEY not set in .env"
    exit 1
fi

print_status "Environment variables configured ✓"

# Check Docker
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker."
    exit 1
fi
print_status "Docker is running ✓"

# Check Solana balance
print_step "Checking Solana mainnet wallet funding..."
BALANCE=$(solana balance -u mainnet-beta 2>/dev/null | grep -o '[0-9]*\.[0-9]*' | head -1 || echo "0")
echo "Current mainnet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 5" | bc -l) )); then
    print_error "Insufficient SOL balance. You need at least 5 SOL for deployment."
    print_error "Current balance: $BALANCE SOL"
    exit 1
fi

print_status "Sufficient SOL balance ✓"

# Generate program keypair if not exists
print_step "Checking OFT program keypair..."
if [ ! -f "target/deploy/oft-keypair.json" ]; then
    print_status "Generating new program keypair..."
    anchor keys sync -p oft
else
    print_status "Program keypair exists ✓"
fi

# Show program ID
PROGRAM_ID=$(anchor keys list | grep "oft:" | awk '{print $2}')
print_status "OFT Program ID: $PROGRAM_ID"

# Build verification
print_step "Building Solana program..."
print_warning "Ensure you're using Solana CLI v1.17.31 and Anchor v0.29.0"

# Check versions
SOLANA_VERSION=$(solana --version | head -n1 | grep -o 'v[0-9]*\.[0-9]*\.[0-9]*')
ANCHOR_VERSION=$(anchor --version | grep -o '[0-9]*\.[0-9]*\.[0-9]*')

echo "Current versions:"
echo "  Solana CLI: $SOLANA_VERSION"
echo "  Anchor: $ANCHOR_VERSION"

if [[ "$SOLANA_VERSION" != "v1.17.31" ]]; then
    print_warning "Recommended Solana version is v1.17.31 for building"
fi

if [[ "$ANCHOR_VERSION" != "0.29.0" ]]; then
    print_warning "Recommended Anchor version is 0.29.0 for building"
fi

echo ""
print_step "Building program (this may take several minutes)..."
anchor build -v -e OFT_ID=$PROGRAM_ID

if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix errors before continuing."
    exit 1
fi

print_status "Build completed successfully ✓"

# Deployment cost estimation
print_step "Estimating deployment costs..."
PROGRAM_SIZE=$(wc -c < target/verifiable/oft.so)
echo "Program size: $PROGRAM_SIZE bytes"
RENT_COST=$(solana rent $PROGRAM_SIZE -u mainnet-beta | grep -o '[0-9]*\.[0-9]*' | head -1)
echo "Estimated rent cost: $RENT_COST SOL"

echo ""
print_bold "🚀 READY FOR MAINNET DEPLOYMENT"
echo "==============================="

echo ""
print_step "Next commands to execute:"
echo ""

print_warning "1. Switch to Solana v1.18.26 for deployment:"
echo "   sh -c \"\$(curl -sSfL https://release.anza.xyz/v1.18.26/install)\""
echo ""

print_warning "2. Deploy Solana program to MAINNET:"
echo "   solana program deploy \\"
echo "     --program-id target/deploy/oft-keypair.json \\"
echo "     target/verifiable/oft.so \\"
echo "     -u mainnet-beta \\"
echo "     --with-compute-unit-price 10000"
echo ""

print_warning "3. Switch back to build version:"
echo "   sh -c \"\$(curl -sSfL https://release.anza.xyz/v1.17.31/install)\""
echo ""

print_warning "4. Create FIGHT token OFT Store on Solana MAINNET:"
echo "   pnpm hardhat lz:oft:solana:create \\"
echo "     --eid 30168 \\"
echo "     --program-id $PROGRAM_ID \\"
echo "     --only-oft-store true \\"
echo "     --amount 1000000000000000000 \\"
echo "     --name \"FIGHT\" \\"
echo "     --symbol \"FIGHT\" \\"
echo "     --uri \"https://assets.fight.foundation/fight_metadata_v1.json\""
echo ""

print_warning "5. Deploy to BSC MAINNET:"
echo "   pnpm hardhat lz:deploy --network bsc-mainnet"
echo ""

print_warning "6. Initialize cross-chain configuration:"
echo "   npx hardhat lz:oft:solana:init-config --oapp-config layerzero.config.ts"
echo ""

print_warning "7. Wire the chains together:"
echo "   pnpm hardhat lz:oapp:wire --oapp-config layerzero.config.ts"
echo ""

print_bold "📋 MAINNET ENDPOINT IDs:"
echo "• Solana Mainnet: 30168"
echo "• BSC Mainnet: 30102"
echo ""

print_error "⚠️  CRITICAL REMINDERS:"
echo "• This is MAINNET deployment with REAL funds"
echo "• Double-check all addresses and parameters"
echo "• Test small amounts first after deployment"
echo "• Keep your private keys secure"
echo "• Consider using multisig wallets for production"
echo ""

print_bold "🥊 Ready to launch FIGHT token on MAINNET!"
echo ""
print_status "Execute the commands above one by one, and verify each step."