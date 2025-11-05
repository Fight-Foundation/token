// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

/**
 * @title FightOFT
 * @dev FIGHT token implementation as an Omnichain Fungible Token (OFT)
 * 
 * The official token of the Fight ecosystem — powering the digital economy of combat sports.
 * $FIGHT enables access, rewards, and governance across Fight.ID, community programs, and partner platforms.
 * 
 * Token Details:
 * - Name: FIGHT
 * - Symbol: FIGHT  
 * - Total Supply: 10,000,000,000 (10 billion)
 * - Decimals: 18 (EVM standard)
 * - Cross-chain compatible via LayerZero OFT standard
 * 
 * Official Links:
 * - Website: https://fight.id
 * - Twitter: https://x.com/JoinFightId
 * - Telegram: https://t.me/fightfiofficial
 * - Discord: https://discord.gg/fightid
 * 
 * @notice This contract enables FIGHT tokens to be transferred seamlessly
 * between different blockchains while maintaining unified liquidity.
 */
contract FightOFT is OFT {
    
    /// @notice Total supply of FIGHT tokens (10 billion with 18 decimals)
    uint256 public constant TOTAL_SUPPLY = 10_000_000_000 * 1e18;
    
    /// @notice Token metadata URI pointing to official FIGHT token metadata
    string public constant METADATA_URI = "https://assets.fight.foundation/fight_metadata_v1.json";
    
    /// @notice Official website URL
    string public constant WEBSITE = "https://fight.id";
    
    /// @notice Verification string for authenticity
    string public constant VERIFICATION = "Official Fight Token - Issued by Fight Tech BVI Ltd.";
    
    /**
     * @dev Constructor to initialize the FIGHT OFT
     * @param _lzEndpoint LayerZero endpoint address for the current chain
     * @param _delegate Address that will own the contract (typically a multisig)
     */
    constructor(
        address _lzEndpoint,
        address _delegate
    ) OFT("FIGHT", "FIGHT", _lzEndpoint, _delegate) Ownable(_delegate) {
        // Mint the total supply to the delegate address
        // This ensures initial supply is available for distribution
        _mint(_delegate, TOTAL_SUPPLY);
    }
    
    /**
     * @notice Returns the metadata URI for the token
     * @return The URI pointing to the token's metadata JSON
     */
    function metadataURI() external pure returns (string memory) {
        return METADATA_URI;
    }
    
    /**
     * @notice Returns the official website URL
     * @return The website URL
     */
    function website() external pure returns (string memory) {
        return WEBSITE;
    }
    
    /**
     * @notice Returns the verification string for authenticity
     * @return The verification string
     */
    function verification() external pure returns (string memory) {
        return VERIFICATION;
    }
}