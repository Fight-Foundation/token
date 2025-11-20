import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

import { getOftStoreAddress } from './tasks/solana'

// TESTING CONFIGURATION - Simplified DVN setup to reduce transaction size
// After successful testing, revert to layerzero.config.ts with full multi-DVN security

const bscContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'FightOFTSecondary',
}

const solanaContract: OmniPointHardhat = {
    eid: EndpointId.SOLANA_V2_MAINNET,
    address: getOftStoreAddress(EndpointId.SOLANA_V2_MAINNET),
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
]

const CU_LIMIT = 200000
const SPL_TOKEN_ACCOUNT_RENT_VALUE = 2039280

const SOLANA_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: CU_LIMIT,
        value: SPL_TOKEN_ACCOUNT_RENT_VALUE,
    },
]

export default async function () {
    const connections = await generateConnectionsConfig([
        [
            bscContract,
            solanaContract,
            // SIMPLIFIED: Only LayerZero Labs DVN for testing
            [['LayerZero Labs'], []],
            [20, 15],
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],
    ])

    return {
        contracts: [{ contract: bscContract }, { contract: solanaContract }],
        connections,
    }
}
