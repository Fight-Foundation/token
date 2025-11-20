const hre = require("hardhat");

async function main() {
    const contractAddress = "0xB2D97C4ed2d0Ef452654F5CAB3da3735B5e6F3ab";
    const solanaRecipient = "B4Ef4SzvDH1ZsfaoDoGcC82xbosPpDAjvASqEjr4THxt"; // EOA on Solana
    const amount = "1000000000000"; // 1e12 (0.000001 tokens with 18 decimals)
    
    console.log("Bridging tokens back to Solana...");
    console.log(`Amount: ${amount} (0.000001 tokens)`);
    console.log(`Recipient: ${solanaRecipient}`);
    
    const [signer] = await hre.ethers.getSigners();
    console.log(`Sender: ${signer.address}`);
    
    const contract = await hre.ethers.getContractAt("FightOFTSecondary", contractAddress);
    
    // Check balance
    const balance = await contract.balanceOf(signer.address);
    console.log(`Current balance: ${balance}`);
    
    if (balance < BigInt(amount)) {
        console.log("❌ Insufficient balance");
        return;
    }
    
    // Encode Solana address as bytes32
    const bs58 = require("bs58");
    const solanaBytes = Buffer.from(bs58.default.decode(solanaRecipient));
    const recipientBytes32 = "0x" + solanaBytes.toString("hex");
    
    console.log(`Encoded recipient: ${recipientBytes32}`);
    
    // Prepare send params
    const dstEid = 30168; // Solana mainnet
    const sendParam = {
        dstEid: dstEid,
        to: recipientBytes32,
        amountLD: amount,
        minAmountLD: amount,
        extraOptions: "0x",
        composeMsg: "0x",
        oftCmd: "0x"
    };
    
    // Quote the fee
    console.log("\nQuoting fee...");
    const feeQuote = await contract.quoteSend(sendParam, false);
    const nativeFee = feeQuote.nativeFee;
    console.log(`Native fee: ${nativeFee} wei`);
    
    // Send tokens
    console.log("\nSending tokens...");
    const tx = await contract.send(
        sendParam,
        { nativeFee: nativeFee, lzTokenFee: 0 },
        signer.address,
        { value: nativeFee }
    );
    
    console.log(`Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Tokens sent in block ${receipt.blockNumber}`);
    console.log(`Transaction: https://bscscan.com/tx/${tx.hash}`);
    console.log("\n⏳ Wait ~5-10 minutes for LayerZero to deliver to Solana");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
