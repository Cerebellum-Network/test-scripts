import {SubstrateService} from "../services/substrate-service";
import {ScenarioInterface} from "./scenario-interface";
import Logger from './../services/logger';

export class Scenarios_1 implements ScenarioInterface {
  logger = new Logger(Scenarios_1.name);

  async run() {
    this.logger.log('Creating SubstrateService instance...');

    const service = new SubstrateService();
    await service.initialize();
    this.logger.log(`SubstrateService instance has been created and initialized successfully`);

    this.logger.log('Generating wallet...');
    const wallet = service.generateWallet();
    this.logger.log(`Wallet has been generated successfully. Value is ${JSON.stringify(wallet)}`);

    this.logger.log(`Issuing assets to the user...`);
    const result = await service.issueAssetToUser(
      wallet.publicKey,
      process.env.AMOUNT,
      process.env.FEE,
    );
    this.logger.log(`Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);

    const balance = await service.getBalance(wallet.publicKey);

    this.logger.log(`Asset balance: ${JSON.stringify(balance)}`);
  }
}
