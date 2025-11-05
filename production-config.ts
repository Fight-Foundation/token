/**
 * FIGHT Token Production Configuration
 * 
 * 🚨 MAINNET DEPLOYMENT SETTINGS 🚨
 * This configuration is for PRODUCTION deployment on mainnet networks.
 * Real funds will be used. Double-check all parameters before deployment.
 */

export const FIGHT_PRODUCTION_CONFIG = {
  // 🌐 Network Configuration
  networks: {
    solana: {
      name: "Solana Mainnet",
      eid: 30168, // Solana Mainnet Endpoint ID
      rpc: "https://api.mainnet-beta.solana.com",
      cluster: "mainnet-beta",
      decimals: 9,
    },
    bsc: {
      name: "BSC Mainnet", 
      eid: 30102, // BSC Mainnet Endpoint ID
      rpc: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      decimals: 18,
    },
  },

  // 🪙 Token Configuration
  token: {
    name: "FIGHT",
    symbol: "FIGHT",
    description: "The official token of the Fight ecosystem — powering the digital economy of combat sports.",
    totalSupply: "10000000000", // 10 billion tokens
    
    // Solana-specific
    solanaDecimals: 9,
    solanaSharedDecimals: 6,
    solanaInitialMint: "1000000000000000000", // 1 billion tokens (1B * 10^9)
    
    // EVM-specific  
    evmDecimals: 18,
    evmTotalSupply: "10000000000000000000000000000", // 10B with 18 decimals
  },

  // 🔗 LayerZero Configuration
  layerzero: {
    confirmations: {
      bscToSolana: 20,  // BSC confirmations required
      solanaToBsc: 15,  // Solana confirmations required
    },
    
    enforcedOptions: {
      solana: {
        gas: 200000,      // Compute Units for Solana
        value: 2039280,   // Rent for SPL token account (lamports)
      },
      evm: {
        gas: 80000,       // Gas limit for EVM chains
        value: 0,         // No native token required
      },
    },

    // Production Security: Multi-DVN Configuration
    dvn: {
      required: ["LayerZero Labs", "Google Cloud", "Polyhedra"], // All must verify
      optional: ["Horizen Labs", "Nethermind"],                  // 2 out of 2 must verify
      securityLevel: "Maximum",
      description: "5 independent DVN verifications per message for maximum security"
    },
  },

  // 🛡️ Security Configuration
  security: {
    onlyOftStore: true,           // Only OFT Store can mint on Solana
    freezeAuthority: null,        // No freeze authority (recommended)
    multisigRecommended: true,    // Use multisig wallets in production
    
    // Production wallet recommendations
    solanaWallet: "Use Squads multisig: https://squads.so/",
    evmWallet: "Use Safe multisig: https://safe.global/",
  },

  // 📊 Deployment Parameters
  deployment: {
    // Minimum balances required for deployment
    minimumBalances: {
      solana: "5 SOL",        // For program deployment and rent
      bsc: "0.1 BNB",         // For contract deployment and gas
    },
    
    // Recommended priority fees
    priorityFees: {
      solana: 10000,          // Micro-lamports per compute unit
      bsc: "10 gwei",         // Gas price for BSC
    },
    
    // Deployment sequence
    deploymentOrder: [
      "1. Deploy Solana program",
      "2. Create Solana OFT Store", 
      "3. Deploy BSC contract",
      "4. Initialize cross-chain config",
      "5. Wire chains together",
      "6. Test with small amounts",
    ],
  },

  // 🔗 Official Links
  links: {
    website: "https://fight.id",
    twitter: "https://x.com/JoinFightId", 
    telegram: "https://t.me/fightfiofficial",
    discord: "https://discord.gg/fightid",
    github: "https://github.com/Fight-Foundation",
    metadata: "https://assets.fight.foundation/fight_metadata_v1.json",
  },

  // ⚠️ Production Checklist
  productionChecklist: [
    "✅ Test deployment on testnets successfully",
    "✅ Verify all private keys are secure and backed up", 
    "✅ Confirm sufficient mainnet balances",
    "✅ Review all contract parameters",
    "✅ Set up monitoring and alerting",
    "✅ Prepare multisig wallets for ongoing operations",
    "✅ Document deployment addresses and transaction hashes",
    "✅ Plan initial token distribution strategy",
    "✅ Coordinate with marketing/community for launch",
    "✅ Have emergency procedures in place",
  ],

  // 📈 Post-Deployment Actions
  postDeployment: [
    "Verify contract source code on block explorers",
    "Submit token metadata to tracking sites", 
    "Set up cross-chain monitoring",
    "Configure governance if applicable",
    "Begin initial token distribution",
    "Announce to community",
    "Monitor for any issues in first 24-48 hours",
  ],
};

export default FIGHT_PRODUCTION_CONFIG;