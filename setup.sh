#!/bin/bash

# FIGHT Token LayerZero OFT Setup Script
# This script sets up the development environment for the FIGHT token OFT project

set -e

echo "🥊 Setting up FIGHT Token LayerZero OFT Project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Checking current versions..."

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Current Node.js version: $NODE_VERSION"

# Check if we need to install/update dependencies
print_warning "You need Anchor version 0.29 and Solana CLI version 1.17.31 specifically for building"
print_warning "Current versions will need to be changed:"
echo "  - Solana CLI: $(solana --version | head -n1)"
echo "  - Anchor: $(anchor --version)"

echo ""
print_status "Would you like to install the required versions? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    print_status "Installing Solana CLI v1.17.31..."
    sh -c "$(curl -sSfL https://release.anza.xyz/v1.17.31/install)"
    
    print_status "Installing Anchor v0.29..."
    cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
    
    print_status "Dependency installation completed!"
else
    print_warning "Skipping dependency installation. Make sure you install them before building:"
    echo "  - Solana CLI v1.17.31: sh -c \"\$(curl -sSfL https://release.anza.xyz/v1.17.31/install)\""
    echo "  - Anchor v0.29: cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked"
fi

echo ""
print_status "Next steps:"
echo "1. Set up your .env file with your private keys/mnemonics"
echo "2. Fund your Solana deployer address: solana airdrop 5 -u devnet"
echo "3. Generate program keypair: anchor keys sync -p oft"
echo "4. Build the program: anchor build -v -e OFT_ID=<PROGRAM_ID>"
echo "5. Deploy and create your FIGHT token!"

echo ""
print_status "🥊 FIGHT Token setup script completed!"
echo "For detailed instructions, see the README.md file."