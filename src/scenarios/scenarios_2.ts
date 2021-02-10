import {SubstrateService} from "../services/substrate-service";
import {ScenarioInterface} from "./scenario-interface";
import Logger from './../services/logger';

export class Scenarios_2 implements ScenarioInterface {
  logger = new Logger(Scenarios_2.name);
  
  async run() {
    this.logger.log('Creating SubstrateService instance scenario 2...');

    const service = new SubstrateService();
    await service.initialize();
    this.logger.log(`SubstrateService instance has been created and initialized successfully`);
    // Generate Wallet
    this.logger.log('Generating wallet...');
    const wallet = service.generateWallet();
    this.logger.log(`Wallet has been generated successfully. Value is ${JSON.stringify(wallet)}`);

    // Check for balance
    this.logger.log(`Checking balance of wallet...`);
    const walletBalance = await service.getBalance(wallet.publicKey);
    this.logger.log(` Balance of wallet is: ${walletBalance}`);

    // Get fee estimation calculation
    this.logger.log(`Generate fee estimation...`);
    const fee = await service.getFeeEstimate(
      wallet.publicKey,
      process.env.AMOUNT,
    );
    this.logger.log(`Fee estimation has been completed successfully. Result is ${fee}`);

    // Send with calculated fee
    this.logger.log(`Issuing assets to the user...`);
    const result = await service.issueAssetToUser(
      wallet.publicKey,
      process.env.AMOUNT,
      fee
    );
    this.logger.log(`Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);

    const balance = await service.getBalance(wallet.publicKey);

    this.logger.log(`Asset balance: ${JSON.stringify(balance)}`);
  }
}
