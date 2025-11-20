import { publicKey } from '@metaplex-foundation/umi'
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import * as anchor from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import { task } from 'hardhat/config'

import { types as devtoolsTypes } from '@layerzerolabs/devtools-evm-hardhat'
import { getSolanaKeypair } from '@layerzerolabs/devtools-solana'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { oft } from '@layerzerolabs/oft-v2-solana-sdk'

import { deriveConnection, getExplorerTxLink, getSolanaDeployment } from './index'

// Import the generated types
import { Oft } from '../../target/types/oft'
import OftIDL from '../../target/idl/oft.json'

interface SetOftConfigArgs {
    eid: EndpointId
    oftStore?: string
    admin?: string
    delegate?: string
}

/**
 * Get the OFTStore account from the task arguments, the deployment file, or throw an error.
 * @param {EndpointId} eid
 * @param {string} oftStore
 */
const getOftStore = (eid: EndpointId, oftStore?: string) => publicKey(oftStore ?? getSolanaDeployment(eid).oftStore)

task('lz:oft:solana:set-oft-config', 'Sets the OFT Store configuration (admin or delegate)')
    .addParam(
        'eid',
        'Solana mainnet (30168) or testnet (40168).  Defaults to mainnet.',
        EndpointId.SOLANA_V2_MAINNET,
        devtoolsTypes.eid
    )
    .addOptionalParam(
        'oftStore',
        'The OFTStore public key. Derived from deployments if not provided.',
        undefined,
        devtoolsTypes.string
    )
    .addOptionalParam('admin', 'The new admin public key', undefined, devtoolsTypes.string)
    .addOptionalParam('delegate', 'The new delegate public key', undefined, devtoolsTypes.string)
    .setAction(async ({ eid, oftStore: oftStoreArg, admin: adminStr, delegate: delegateStr }: SetOftConfigArgs) => {
        if (!adminStr && !delegateStr) {
            throw new Error('Must provide either --admin or --delegate')
        }

        const { umi, connection } = await deriveConnection(eid)
        const oftStoreKey = getOftStore(eid, oftStoreArg)

        // Fetch current OFT Store info
        const oftStoreInfo = await oft.accounts.fetchOFTStore(umi, oftStoreKey)
        
        console.log('\n=== Current Configuration ===')
        console.log(`OFT Store: ${oftStoreKey}`)
        console.log(`Current Admin: ${oftStoreInfo.admin}`)
        console.log(`Program ID: ${oftStoreInfo.header.owner}`)

        // Get keypair and create Anchor provider
        const keypair = await getSolanaKeypair()
        const wallet = new anchor.Wallet(keypair)
        const provider = new anchor.AnchorProvider(connection, wallet, {})
        const programId = new PublicKey(oftStoreInfo.header.owner.toString())
        const program = new anchor.Program(OftIDL as anchor.Idl, programId, provider) as unknown as anchor.Program<Oft>

        const oftStore = toWeb3JsPublicKey(oftStoreKey)

        // Set Admin if provided
        if (adminStr) {
            const newAdmin = new PublicKey(adminStr)
            console.log(`\n📝 Setting Admin to: ${newAdmin.toBase58()}`)

            const tx = await program.methods
                // @ts-ignore - Anchor enum serialization
                .setOftConfig({ admin: [newAdmin] })
                .accounts({
                    admin: wallet.publicKey,
                    oftStore,
                })
                .rpc()

            const adminTxLink = getExplorerTxLink(tx, eid === EndpointId.SOLANA_V2_TESTNET)
            console.log(`✅ Admin Set Transaction: ${adminTxLink}`)
        }

        // Set Delegate if provided
        if (delegateStr) {
            const newDelegate = new PublicKey(delegateStr)
            console.log(`\n📝 Setting Delegate to: ${newDelegate.toBase58()}`)

            // Derive oappRegistry PDA - seeds are [b"OApp", oftStore]
            const endpointProgram = new PublicKey(oftStoreInfo.endpointProgram.toString())
            const [oappRegistry] = PublicKey.findProgramAddressSync(
                [Buffer.from('OApp'), oftStore.toBuffer()],
                endpointProgram
            )

            const tx = await program.methods
                // @ts-ignore - Anchor enum serialization
                .setOftConfig({ delegate: [newDelegate] })
                .accounts({
                    admin: wallet.publicKey,
                    oftStore,
                })
                .remainingAccounts([
                    { pubkey: endpointProgram, isSigner: false, isWritable: false },
                    { pubkey: oappRegistry, isSigner: false, isWritable: true },
                ])
                .rpc()

            const delegateTxLink = getExplorerTxLink(tx, eid === EndpointId.SOLANA_V2_TESTNET)
            console.log(`✅ Delegate Set Transaction: ${delegateTxLink}`)
        }

        console.log('\n🎉 Configuration updated successfully!')
        console.log('\nRun the debug command to verify:')
        console.log(`npx hardhat lz:oft:solana:debug --eid ${eid}`)
    })
