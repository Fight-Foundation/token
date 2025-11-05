#!/bin/bash

# FIGHT Token Deployment Script
# This script guides you through deploying the FIGHT token as a LayerZero OFT

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

echo "🥊 FIGHT Token LayerZero OFT Deployment"
echo "======================================"

# Check if .env exists and has required variables
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create it from .env.example"
    exit 1
fi

print_status "Checking environment setup..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker before continuing."
    exit 1
fi

print_status "Docker is running ✓"

# Verify Solana CLI version
SOLANA_VERSION=$(solana --version | head -n1 | grep -o 'v[0-9]*\.[0-9]*\.[0-9]*')
if [[ "$SOLANA_VERSION" != "v1.17.31" ]]; then
    print_warning "Solana CLI version is $SOLANA_VERSION, but v1.17.31 is required for building"
    print_warning "Please install the correct version: sh -c \"\$(curl -sSfL https://release.anza.xyz/v1.17.31/install)\""
fi

# Check if user has funding
print_step "1. Checking Solana wallet funding..."
BALANCE=$(solana balance -u devnet 2>/dev/null | grep -o '[0-9]*\.[0-9]*' | head -1 || echo "0")
echo "Current devnet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 5" | bc -l) )); then
    print_warning "You need at least 5 SOL on devnet for deployment"
    echo "Run: solana airdrop 5 -u devnet"
    echo "Or use: https://faucet.solana.com/"
    echo ""
    read -p "Press Enter after funding your wallet..."
fi

# Generate program keypair
print_step "2. Generating OFT program keypair..."
if [ ! -f "target/deploy/oft-keypair.json" ]; then
    anchor keys sync -p oft
    print_status "Program keypair generated"
else
    print_status "Program keypair already exists"
fi

# Show program ID
PROGRAM_ID=$(anchor keys list | grep "oft:" | awk '{print $2}')
print_status "OFT Program ID: $PROGRAM_ID"

# Build the program
print_step "3. Building the Solana OFT program..."
echo "This may take several minutes..."
anchor build -v -e OFT_ID=$PROGRAM_ID

if [ $? -eq 0 ]; then
    print_status "Build completed successfully ✓"
else
    print_error "Build failed. Please check the error messages above."
    exit 1
fi

# Show estimated rent costs
print_step "4. Estimated deployment costs:"
PROGRAM_SIZE=$(wc -c < target/verifiable/oft.so)
echo "Program size: $PROGRAM_SIZE bytes"
solana rent $PROGRAM_SIZE -u devnet

echo ""
print_step "5. Ready to deploy!"
echo ""
echo "Next commands to run:"
echo "====================="
echo ""
echo "# Switch to Solana v1.18.26 for deployment (recommended)"
echo "sh -c \"\$(curl -sSfL https://release.anza.xyz/v1.18.26/install)\""
echo ""
echo "# Deploy the program with priority fee (replace XXXX with your desired priority fee)"
echo "solana program deploy --program-id target/deploy/oft-keypair.json target/verifiable/oft.so -u devnet --with-compute-unit-price XXXX"
echo ""
echo "# Switch back to v1.17.31 after deployment"
echo "sh -c \"\$(curl -sSfL https://release.anza.xyz/v1.17.31/install)\""
echo ""
echo "# Create the FIGHT token OFT Store with initial supply (1 billion tokens)"
echo "pnpm hardhat lz:oft:solana:create --eid 40168 --program-id $PROGRAM_ID --only-oft-store true --amount 1000000000000000000 --name \"FIGHT\" --symbol \"FIGHT\" --uri \"https://assets.fight.foundation/fight_metadata_v1.json\""
echo ""
echo "🥊 Program is ready for deployment!"