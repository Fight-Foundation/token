import { EndpointId } from '@layerzerolabs/lz-definitions'

const bscContract = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'FightOFTSecondary',
    address: '0xeBB1677084E249947475BfBc5442bFd41265eFa7',
}

export default {
    contracts: [
        {
            contract: bscContract,
        },
    ],
    connections: [],
}