// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

/**
 * @title FightOFTSecondary
 * @dev FIGHT token OFT for secondary chains - NO initial minting
 */
contract FightOFTSecondary is OFT {
    
    uint256 public constant SUPPLY_CAP = 10_000_000_000 * 1e18;
    
    /**
     * @dev Constructor - NO TOKENS ARE MINTED
     * @param _lzEndpoint LayerZero endpoint address
     * @param _delegate Contract owner address
     */
    constructor(
        address _lzEndpoint,
        address _delegate
    ) OFT("FIGHT", "FIGHT", _lzEndpoint, _delegate) Ownable(_delegate) {
        // NO minting - tokens come from cross-chain transfers only
    }
}