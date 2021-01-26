import {SubstrateService} from "../substrate-service";
import {ScenarioInterface} from "./scenario-interface";
import API from '@polkadot/api';

export class Scenarios_3 implements ScenarioInterface {
  async run() {
    /*
       TODO: Implement Scenario 3 [Batch processing]:
         * Create 3 user wallets
         * Sends assets to those wallets using batch transaction using link: https://github.com/Cerebellum-Network/private-standalone-network-node/blob/dev/docs/batch_processing.md
     */
    console.log('[MAIN] Creating SubstrateService instance scenario 3...');

    const service = new SubstrateService();
    await service.initialize();
    console.log(`[MAIN] SubstrateService instance has been created and initialized successfully`);

    // Generating Wallets
    console.log('[MAIN] Generating wallet...');
    const apple = service.generateWallet();
    console.log(`[MAIN] Wallet has been generated successfully. Value is ${JSON.stringify(apple)}`);

    console.log('[MAIN] Generating wallet...');
    const orange = service.generateWallet();
    console.log(`[MAIN] Wallet has been generated successfully. Value is ${JSON.stringify(orange)}`);

    console.log('[MAIN] Generating wallet...');
    const banana = service.generateWallet();
    console.log(`[MAIN] Wallet has been generated successfully. Value is ${JSON.stringify(banana)}`);

    // Batch transactions
    console.log(`[MAIN] Issuing assets to the user...`);
    const result = await service.issueAssetToUserBatch(
      apple.publicKey,
      process.env.AMOUNT,
      orange.publicKey,
      banana.publicKey
    );
    console.log(`[MAIN] Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);

    const appleBalance = await service.getBalance(apple.publicKey);
    console.log(`[MAIN] Asset balance: ${JSON.stringify(appleBalance)}`);

    const orangeBalance = await service.getBalance(apple.publicKey);
    console.log(`[MAIN] Asset balance: ${JSON.stringify(orangeBalance)}`);

    const bananaBalance = await service.getBalance(apple.publicKey);
    console.log(`[MAIN] Asset balance: ${JSON.stringify(bananaBalance)}`);

    
  }
}
