/**
 * FIGHT Token Configuration
 * 
 * Token Metadata:
 * - Name: FIGHT
 * - Symbol: FIGHT  
 * - Description: The official token of the Fight ecosystem
 * - Total Supply: 10,000,000,000 tokens
 * - Decimals: 9
 * - Token Type: SPL Token (Solana) / ERC-20 (EVM)
 */

export const FIGHT_TOKEN_CONFIG = {
  // Basic token information
  name: "FIGHT",
  symbol: "FIGHT", 
  description: "The official token of the Fight ecosystem — powering the digital economy of combat sports. $FIGHT enables access, rewards, and governance across Fight.ID, community programs, and partner platforms.",
  
  // Token parameters
  decimals: 9,
  totalSupply: "10000000000", // 10 billion tokens
  sharedDecimals: 6, // LayerZero shared decimals for cross-chain transfers
  
  // Metadata and branding
  image: "https://assets.fight.foundation/FIGHT_Token_Icon/white_orange_bg/FightCoin1024.jpg",
  metadataUri: "https://assets.fight.foundation/fight_metadata_v1.json",
  
  // Project information
  website: "https://fight.id",
  twitter: "https://x.com/JoinFightId", 
  telegram: "https://t.me/fightfiofficial",
  github: "https://github.com/Fight-Foundation",
  discord: "https://discord.gg/fightid",
  
  // Mint authority configuration
  onlyOftStore: true, // Only the OFT Store can mint (recommended for security)
  freezeAuthority: "", // No freeze authority (tokens cannot be frozen)
  
  // Initial distribution
  initialMintAmount: "1000000000000000000", // 1 billion tokens with 9 decimals (1B * 10^9)
  
  // Creator information (from metadata)
  creator: "B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt",
  
  // Verification
  verification: "Official Fight Token - Issued by Fight Tech BVI Ltd.",
  
  // Launch information
  launchDate: "October 2025",
  category: "Utility Token"
};

export default FIGHT_TOKEN_CONFIG;