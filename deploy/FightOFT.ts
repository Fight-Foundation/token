import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'FightOFT'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)
    console.log(`Deploying FIGHT Token OFT...`)

    // This is an external deployment pulled in from @layerzerolabs/lz-evm-sdk-v2
    //
    // @layerzerolabs/toolbox-hardhat takes care of plugging in the external deployments
    // from @layerzerolabs packages based on the configuration in your hardhat config
    //
    // For this to work correctly, your network config must define an eid property
    // set to `EndpointId` as defined in @layerzerolabs/lz-definitions
    //
    // For example:
    //
    // networks: {
    //   'arbitrum-sepolia': {
    //     ...
    //     eid: 40231 // Arbitrum Sepolia
    //   }
    // }
    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    console.log(`LayerZero EndpointV2 address: ${endpointV2Deployment.address}`)

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner/delegate - will receive initial token supply
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`✅ FIGHT Token OFT deployed!`)
    console.log(`Contract: ${contractName}`)
    console.log(`Network: ${hre.network.name}`) 
    console.log(`Address: ${address}`)
    console.log(`Total Supply: 10,000,000,000 FIGHT`)
    console.log(`Decimals: 18`)
    console.log(`Owner: ${deployer}`)
    console.log(``)
    console.log(`🥊 The official token of the Fight ecosystem is now live!`)
    console.log(`Visit: https://fight.id`)
}

deploy.tags = [contractName]

export default deploy