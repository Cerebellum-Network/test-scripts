import {SubstrateService} from "../substrate-service";
import {ScenarioInterface} from "./scenario-interface";

export class Scenarios_2 implements ScenarioInterface {
  async run() {
    console.log('[MAIN] Creating SubstrateService instance scenario 2...');

    const service = new SubstrateService();
    await service.initialize();
    console.log(`[MAIN] SubstrateService instance has been created and initialized successfully`);
    // Generate Wallet
    console.log('[MAIN] Generating wallet...');
    const wallet = service.generateWallet();
    console.log(`[MAIN] Wallet has been generated successfully. Value is ${JSON.stringify(wallet)}`);

    // Check for balance
    console.log(`[MAIN] Checking balance of wallet...`)
    const walletBalance = await service.getBalance(wallet.publicKey);
    console.log(` [MAIN] Balance of wallet is: ${walletBalance}`)

    // Get fee estimation calculation
    console.log(`[MAIN] Generate fee estimation...`);
    const fee = await service.getFeeEstimate(
      wallet.publicKey,
      process.env.AMOUNT,
    );
    console.log(`[MAIN] Fee estimation has been completed successfully. Result is ${fee}`);

    // Send with calculated fee
    console.log(`[MAIN] Issuing assets to the user...`);
    const result = await service.issueAssetToUser(
      wallet.publicKey,
      process.env.AMOUNT,
      fee
    );
    console.log(`[MAIN] Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);

    const balance = await service.getBalance(wallet.publicKey);

    console.log(`[MAIN] Asset balance: ${JSON.stringify(balance)}`);
  }
}
