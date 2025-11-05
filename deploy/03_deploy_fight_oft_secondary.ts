import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    console.log('🔄 Deploying FightOFTSecondary (corrected version)...')
    console.log('📍 Network:', hre.network.name)
    console.log('👤 Deployer:', deployer)
    
    // BSC Mainnet LayerZero V2 endpoint
    const lzEndpoint = '0x1a44076050125825900e736c501f859c50fE728c'
    
    console.log('🌐 LayerZero Endpoint:', lzEndpoint)
    console.log('⚠️  NOTE: This version does NOT mint initial supply!')
    console.log('💡 Tokens will only exist when transferred from Solana')
    
    const result = await deploy('FightOFTSecondary', {
        from: deployer,
        args: [lzEndpoint, deployer], // endpoint, delegate (no minting!)
        log: true,
        waitConfirmations: 5,
        gasLimit: 3000000,
    })

    console.log('')
    console.log('✅ FightOFTSecondary deployed successfully!')
    console.log('📍 Contract Address:', result.address)
    console.log('🔗 BSCScan:', `https://bscscan.com/address/${result.address}`)
    console.log('💰 Initial Supply:', '0 FIGHT (as expected)')
    console.log('🎯 Owner:', deployer)
    console.log('')
    console.log('🚀 Ready for cross-chain configuration!')
}

export default deployFunction

deployFunction.tags = ['FightOFTSecondary']