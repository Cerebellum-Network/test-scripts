import {SubstrateService} from "../services/substrate-service";
import {ScenarioInterface} from "./scenario-interface";
import Logger from './../services/logger';

export class Scenarios_3 implements ScenarioInterface {
  logger = new Logger(Scenarios_3.name);

  async run() {
    this.logger.log('Creating SubstrateService instance scenario 3...');

    const service = new SubstrateService();
    await service.initialize();
    this.logger.log(`SubstrateService instance has been created and initialized successfully`);

    this.logger.log('Generating wallet...');
    const alice = service.generateWallet();
    this.logger.log(`Wallet has been generated successfully. Value is ${JSON.stringify(alice)}`);

    this.logger.log('Generating wallet...');
    const jim = service.generateWallet();
    this.logger.log(`Wallet has been generated successfully. Value is ${JSON.stringify(jim)}`);

    this.logger.log('Generating wallet...');
    const bob = service.generateWallet();
    this.logger.log(`Wallet has been generated successfully. Value is ${JSON.stringify(bob)}`);

    // Batch transactions
    this.logger.log(`Issuing assets to the user...`);
    const wallets = [alice.publicKey, jim.publicKey, bob.publicKey];
    const result = await service.issueAssetToUserBatch(
      process.env.AMOUNT,
      wallets
    );
    this.logger.log(`Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);

    const appleBalance = await service.getBalance(alice.publicKey);
    this.logger.log(`Asset balance: ${JSON.stringify(appleBalance)}`);

    const orangeBalance = await service.getBalance(jim.publicKey);
    this.logger.log(`Asset balance: ${JSON.stringify(orangeBalance)}`);

    const bananaBalance = await service.getBalance(bob.publicKey);
    this.logger.log(`Asset balance: ${JSON.stringify(bananaBalance)}`);
  }
}
