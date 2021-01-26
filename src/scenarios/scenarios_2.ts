import {SubstrateService} from "../substrate-service";
import {ScenarioInterface} from "./scenario-interface";

export class Scenarios_2 implements ScenarioInterface {
  async run() {
        /*
      TODO: Implement Scenario 2 [Abstract Fee]:
        * Create user's wallet
        * Send small amount of native tokens to the user
        * Estimate fees using this link: https://github.com/Cerebellum-Network/private-standalone-network-node/blob/dev/docs/fee_abstraction.md
        * Put estimated fee parameter to the `transfer` function
    */
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



    console.log(`[MAIN] Generate fee estimation...`);
    const fee = await service.getFeeEstimate(
      wallet.publicKey,
      process.env.SCENARIO_2_AMOUNT,
    );
    console.log(`[MAIN] Fee estimation has been completed successfully. Result is ${fee}`);

    console.log(`[MAIN] Issuing assets to the user...`);
    const result = await service.issueAssetToUser(
      wallet.publicKey,
      process.env.SCENARIO_2_AMOUNT,
      fee
    );
    console.log(`[MAIN] Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);

    const balance = await service.getBalance(wallet.publicKey);

    console.log(`[MAIN] Asset balance: ${JSON.stringify(balance)}`);
  }
}
