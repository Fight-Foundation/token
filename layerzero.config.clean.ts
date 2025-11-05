import { EndpointId } from '@layerzerolabs/lz-definitions'

const bscContract = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'FightOFTSecondary',
    address: '0xeBB1677084E249947475BfBc5442bFd41265eFa7', // Corrected BSC contract (0 initial supply)
}

const solanaContract = {
    eid: EndpointId.SOLANA_V2_MAINNET,
    address: 'FXnms2y5FUjzxzEaDEnEF54pYWZLteTdKUwQhDbCAUfL', // Deployed Solana program
}

export default {
    contracts: [
        {
            contract: bscContract,
        },
        {
            contract: solanaContract,
        },
    ],
    connections: [
        {
            from: bscContract,
            to: solanaContract,
            config: {
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10000,
                        executor: '0x1a44076050125825900e736c501f859c50fE728c', // BSC LayerZero Executor V2
                    },
                    ulnConfig: {
                        confirmations: 15, // BSC confirmations
                        requiredDVNs: [
                            '0xfD6865c841c2d64565562fCc7e05e619A30615f0', // LayerZero Labs DVN
                            '0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193', // Google Cloud DVN  
                            '0x31F748a368a893Bdb5aBB67ec95F232507601A73', // Polyhedra Network DVN
                        ],
                        optionalDVNs: [
                            '0xd56e4eAb23cb81f43168F9F45211Eb027b9aC7cc', // Horizen Labs DVN
                            '0x6A02D83e8d433304bba74EF1c427913958187142', // Nethermind DVN
                        ],
                        optionalDVNThreshold: 1,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 1, // Solana confirmations (fast finality)
                        requiredDVNs: [
                            '0xfD6865c841c2d64565562fCc7e05e619A30615f0', // LayerZero Labs DVN
                            '0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193', // Google Cloud DVN
                            '0x31F748a368a893Bdb5aBB67ec95F232507601A73', // Polyhedra Network DVN
                        ],
                        optionalDVNs: [
                            '0xd56e4eAb23cb81f43168F9F45211Eb027b9Ac7cc', // Horizen Labs DVN
                            '0x6A02D83e8d433304bba74EF1c427913958187142', // Nethermind DVN
                        ],
                        optionalDVNThreshold: 1,
                    },
                },
            },
        },
        {
            from: solanaContract,
            to: bscContract,
            config: {
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10000,
                        executor: '9rKKLbELtDrqJvNiWZ7vdaecTrqYrREQQDpg1byWzSPL', // Solana LayerZero Executor V2
                    },
                    ulnConfig: {
                        confirmations: 1, // Solana confirmations (fast finality)
                        requiredDVNs: [
                            'HtEYV4xB4wvsj5fgTkcfuChYpvGYzgzwvNhgDZQNh7wW', // LayerZero Labs DVN Solana
                            '2ZKiAM3pBPV2rWqHgnhGYJes4HhcybBH6RGXcMZg8', // Google Cloud DVN Solana
                            'FVjzdc2QSDah8vMjpoGJGcKiJes4HhcybBH6RGXcMZg8', // Polyhedra Network DVN Solana
                        ],
                        optionalDVNs: [
                            'GR7FkuiVzbu8iHV95z9j6zBZREZFMmRXT4MmRKiUqDRQ', // Horizen Labs DVN Solana
                            'DPC6dKgLasCC4vphXedyBtEVJAJf4cwgtMK3xaAVnmwa', // Nethermind DVN Solana
                        ],
                        optionalDVNThreshold: 1,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: 15, // BSC confirmations
                        requiredDVNs: [
                            'HtEYV4xB4wvsj5fgTkcfuChYpvGYzgzwvNhgDZQNh7wW', // LayerZero Labs DVN Solana
                            '2ZKiAM3pBPV2rWqHgnhGYJes4HhcybBH6RGXcMZg8', // Google Cloud DVN Solana
                            'FVjzdc2QSDah8vMjpoGJGcKiJes4HhcybBH6RGXcMZg8', // Polyhedra Network DVN Solana
                        ],
                        optionalDVNs: [
                            'GR7FkuiVzbu8iHV95z9j6zBZREZFMmRXT4MmRKiUqDRQ', // Horizen Labs DVN Solana
                            'DPC6dKgLasCC4vphXedyBtEVJAJf4cwgtMK3xaAVnmwa', // Nethermind DVN Solana
                        ],
                        optionalDVNThreshold: 1,
                    },
                },
            },
        },
    ],
}