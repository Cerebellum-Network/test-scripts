import {SubstrateService} from "../substrate-service";
import {ScenarioInterface} from "./scenario-interface";

export class Scenarios_1 implements ScenarioInterface {
  async run() {
    console.log('[MAIN] Creating SubstrateService instance...');

    const service = new SubstrateService();
    await service.initialize();
    console.log(`[MAIN] SubstrateService instance has been created and initialized successfully`);

    console.log('[MAIN] Generating wallet...');
    const wallet = service.generateWallet();
    console.log(`[MAIN] Wallet has been generated successfully. Value is ${JSON.stringify(wallet)}`);

    console.log(`[MAIN] Issuing assets to the user...`);
    const result = await service.issueAssetToUser(
      wallet.publicKey,
      process.env.AMOUNT,
      process.env.FEE,
    );
    console.log(`[MAIN] Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);

    const balance = await service.getBalance(wallet.publicKey);

    console.log(`[MAIN] Asset balance: ${JSON.stringify(balance)}`);
  }
}
