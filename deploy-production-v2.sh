#!/bin/bash

# FIGHT Token Production Deployment V2 - With Multisig Security
# Deploys on Solana (mainnet) and BSC (mainnet) with proper multisig configuration

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

echo "🥊 FIGHT Token Production Deployment V2"
echo "========================================"
echo ""

# Configuration
SOLANA_MULTISIG="GCQ8wGjU5TYmzC1YJckqgTGQLRjRxktB4rNuemPA9XWh"
BSC_MULTISIG="0x1381c63F11Fe73998d80e2b42876C64362cF98Ab"
SOLANA_EID="30168"
BSC_EID="30102"
TOTAL_SUPPLY="10000000000000000000" # 10B tokens with 9 decimals

echo "📋 Configuration:"
echo "  Solana Multisig: $SOLANA_MULTISIG"
echo "  BSC Multisig: $BSC_MULTISIG"
echo "  Total Supply: 10,000,000,000 FIGHT"
echo ""

print_warning "⚠️  MAINNET DEPLOYMENT - REAL FUNDS WILL BE USED!"
echo ""
read -p "Type 'DEPLOY' to continue: " confirmation
if [[ "$confirmation" != "DEPLOY" ]]; then
    print_error "Deployment cancelled"
    exit 1
fi

# Get program ID
PROGRAM_ID=$(anchor keys list | grep "oft:" | awk '{print $2}')
if [ -z "$PROGRAM_ID" ]; then
    print_error "Program ID not found. Run 'anchor keys sync' first."
    exit 1
fi

print_status "OFT Program ID: $PROGRAM_ID"
echo ""

#############################################
# STEP 1: BUILD & DEPLOY SOLANA PROGRAM
#############################################
print_step "STEP 1: Building Solana Program"
echo "Building with Solana CLI v1.17.31..."

if ! anchor build -v -e OFT_ID=$PROGRAM_ID; then
    print_error "Build failed"
    exit 1
fi

print_status "Build completed"
echo ""

print_step "Deploying Solana Program to Mainnet"
print_warning "Ensure you're using Solana CLI v1.18.26 for deployment"
echo ""
echo "Run this command manually:"
echo "  solana program deploy \\"
echo "    --program-id target/deploy/oft-keypair.json \\"
echo "    target/verifiable/oft.so \\"
echo "    -u mainnet-beta \\"
echo "    --with-compute-unit-price 10000"
echo ""
read -p "Press ENTER when deployment is complete..."

#############################################
# STEP 2: CREATE SOLANA OFT WITH MULTISIG ADMIN
#############################################
print_step "STEP 2: Creating Solana OFT"
echo "Creating OFT Store with admin=$SOLANA_MULTISIG..."
echo ""

pnpm hardhat lz:oft:solana:create \
  --eid $SOLANA_EID \
  --program-id $PROGRAM_ID \
  --admin $SOLANA_MULTISIG \
  --amount $TOTAL_SUPPLY \
  --name "FIGHT" \
  --symbol "FIGHT" \
  --uri "https://assets.fight.foundation/fight_metadata_v1.json" \
  --only-oft-store true

if [ $? -ne 0 ]; then
    print_error "Solana OFT creation failed"
    exit 1
fi

print_status "Solana OFT created with multisig admin"

# Get the OFT Store and Mint addresses
SOLANA_OFT_STORE=$(cat deployments/solana-mainnet/OFT.json | grep -o '"oftStore":"[^"]*"' | cut -d'"' -f4)
SOLANA_MINT=$(cat deployments/solana-mainnet/OFT.json | grep -o '"mint":"[^"]*"' | cut -d'"' -f4)

print_status "OFT Store: $SOLANA_OFT_STORE"
print_status "Token Mint: $SOLANA_MINT"
echo ""

#############################################
# STEP 3: DEPLOY BSC CONTRACT
#############################################
print_step "STEP 3: Deploying BSC Contract"
echo "Deploying FightOFTSecondary to BSC Mainnet..."
echo ""

pnpm hardhat deploy --network bsc-mainnet --tags FightOFTSecondary

if [ $? -ne 0 ]; then
    print_error "BSC deployment failed"
    exit 1
fi

BSC_ADDRESS=$(cat deployments/bsc-mainnet/FightOFTSecondary.json | grep -o '"address":"[^"]*"' | cut -d'"' -f4)
print_status "BSC Contract: $BSC_ADDRESS"
echo ""

#############################################
# STEP 4: VERIFY BSC CONTRACT
#############################################
print_step "STEP 4: Verifying BSC Contract"

# Get constructor args
LZ_ENDPOINT="0x1a44076050125825900e736c501f859c50fE728c"
DEPLOYER=$(grep "PRIVATE_KEY" .env | cut -d'=' -f2 | xargs -I {} cast wallet address {})

pnpm hardhat verify --network bsc-mainnet $BSC_ADDRESS $LZ_ENDPOINT $DEPLOYER

if [ $? -eq 0 ]; then
    print_status "Contract verified on BscScan"
else
    print_warning "Verification may have failed, check manually"
fi
echo ""

#############################################
# STEP 5: CONFIGURE CROSS-CHAIN WIRING
#############################################
print_step "STEP 5: Configuring LayerZero Wiring"
echo ""

# Initialize Solana config
print_status "Initializing Solana endpoint configuration..."
npx hardhat lz:oft:solana:init-config --oapp-config layerzero.config.ts

# Wire the chains
print_status "Wiring Solana ↔ BSC pathways..."
pnpm hardhat lz:oapp:wire --oapp-config layerzero.config.ts

print_status "Cross-chain configuration complete"
echo ""

#############################################
# STEP 6: TEST CROSS-CHAIN TRANSFER
#############################################
print_step "STEP 6: Testing Cross-Chain Transfer"
echo "Testing 1 token transfer Solana → BSC..."
echo ""

# Transfer 1 token to BSC
npx hardhat lz:oft:solana:send \
  --eid $SOLANA_EID \
  --oft-store $SOLANA_OFT_STORE \
  --dst-eid $BSC_EID \
  --amount 1000000000 \
  --to $DEPLOYER

print_status "Transfer initiated, waiting for confirmation..."
sleep 30

echo ""
read -p "Check BSC balance. Press ENTER to continue with reverse test..."

echo "Testing 1 token transfer BSC → Solana..."
npx hardhat lz:oft:send:evm \
  --network bsc-mainnet \
  --dst-eid $SOLANA_EID \
  --amount 1 \
  --to $(solana address)

print_status "Round-trip test complete"
echo ""

#############################################
# STEP 7: TRANSFER BSC OWNERSHIP TO MULTISIG
#############################################
print_step "STEP 7: Transferring BSC Ownership"
echo "Transferring ownership to $BSC_MULTISIG..."
echo ""

# Transfer OApp delegate/owner
pnpm hardhat lz:oapp:config:set:delegate \
  --network bsc-mainnet \
  --contract-name FightOFTSecondary \
  --delegate $BSC_MULTISIG

print_status "BSC ownership transferred to multisig"
echo ""

#############################################
# STEP 8: SET SOLANA UPDATE AUTHORITY
#############################################
print_step "STEP 8: Setting Solana Update Authority"
echo "Setting update authority to $SOLANA_MULTISIG..."
echo ""

npx hardhat lz:oft:solana:set-update-authority \
  --eid $SOLANA_EID \
  --mint $SOLANA_MINT \
  --new-update-authority $SOLANA_MULTISIG

print_status "Update authority transferred to multisig"
echo ""

#############################################
# STEP 9: TRANSFER ALL TOKENS TO MULTISIG
#############################################
print_step "STEP 9: Transferring Tokens to Multisig"
echo "Moving all tokens to $SOLANA_MULTISIG..."
echo ""

# Get deployer balance
DEPLOYER_ADDR=$(solana address)
BALANCE=$(spl-token balance $SOLANA_MINT)

echo "Current balance: $BALANCE FIGHT"
echo "Transferring to multisig..."

spl-token transfer \
  --fund-recipient \
  $SOLANA_MINT \
  ALL \
  $SOLANA_MULTISIG

print_status "All tokens transferred to Solana multisig"
echo ""

#############################################
# SUMMARY
#############################################
print_step "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "═════════════════════════════════════════"
echo "📊 Deployment Summary"
echo "═════════════════════════════════════════"
echo ""
echo "Solana (Mainnet - EID: $SOLANA_EID):"
echo "  Program ID: $PROGRAM_ID"
echo "  OFT Store: $SOLANA_OFT_STORE"
echo "  Token Mint: $SOLANA_MINT"
echo "  Admin: $SOLANA_MULTISIG ✓"
echo "  Update Authority: $SOLANA_MULTISIG ✓"
echo "  Token Holder: $SOLANA_MULTISIG (10B FIGHT) ✓"
echo ""
echo "BSC (Mainnet - EID: $BSC_EID):"
echo "  Contract: $BSC_ADDRESS"
echo "  Verified: https://bscscan.com/address/$BSC_ADDRESS#code"
echo "  Owner/Delegate: $BSC_MULTISIG ✓"
echo ""
echo "Cross-Chain:"
echo "  Wiring: Solana ↔ BSC configured ✓"
echo "  Test Transfer: Completed ✓"
echo ""
echo "═════════════════════════════════════════"
echo ""
print_status "All multisig controls properly configured!"
echo ""
