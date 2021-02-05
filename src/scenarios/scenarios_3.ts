import {SubstrateService} from "../substrate-service";
import {ScenarioInterface} from "./scenario-interface";

export class Scenarios_3 implements ScenarioInterface {
  async run() {
    console.log('[MAIN] Creating SubstrateService instance scenario 3...');

    const service = new SubstrateService();
    await service.initialize();
    console.log(`[MAIN] SubstrateService instance has been created and initialized successfully`);

    // Generating Wallets
    console.log('[MAIN] Generating wallet...');
    const alice = service.generateWallet();
    console.log(`[MAIN] Wallet has been generated successfully. Value is ${JSON.stringify(alice)}`);

    console.log('[MAIN] Generating wallet...');
    const jim = service.generateWallet();
    console.log(`[MAIN] Wallet has been generated successfully. Value is ${JSON.stringify(jim)}`);

    console.log('[MAIN] Generating wallet...');
    const bob = service.generateWallet();
    console.log(`[MAIN] Wallet has been generated successfully. Value is ${JSON.stringify(bob)}`);

    // Batch transactions
    console.log(`[MAIN] Issuing assets to the user...`);
    const wallets = [alice.publicKey, jim.publicKey, bob.publicKey]
    const result = await service.issueAssetToUserBatch(
      process.env.AMOUNT,
      wallets
    );
    console.log(`[MAIN] Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);

    const appleBalance = await service.getBalance(alice.publicKey);
    console.log(`[MAIN] Asset balance: ${JSON.stringify(appleBalance)}`);

    const orangeBalance = await service.getBalance(jim.publicKey);
    console.log(`[MAIN] Asset balance: ${JSON.stringify(orangeBalance)}`);

    const bananaBalance = await service.getBalance(bob.publicKey);
    console.log(`[MAIN] Asset balance: ${JSON.stringify(bananaBalance)}`);
  }
}
