import { SubstrateService } from "../services/substrate-service";
import { ScenarioInterface } from "./scenario-interface";
import Logger from "./../services/logger";

export class Scenarios_5 implements ScenarioInterface {
  logger = new Logger(Scenarios_5.name);

  async run() {
    /*
       TODO: Implement Scenario 5 [Send Data Transaction]:
         * Create 3 user wallets
         * Sends Data transaction for each account
     */
    this.logger.log("Creating SubstrateService instance scenario 5...");

    const service = new SubstrateService();
    await service.initialize();

    this.logger.log(
      `SubstrateService instance has been created and initialized successfully`
    );

    // Generating Wallets
    this.logger.log("Generating wallet...");
    const wallet = service.generateWallet();
    this.logger.log(
      `Wallet has been generated successfully. Value is ${JSON.stringify(
        wallet
      )}`
    );

    const dataToSend = "This is a test message";

    const result = await service.sendData(wallet.publicKey, dataToSend);

    this.logger.log(`The data has been transmitted successfully.`);

    const data = await service.retrieveData(result.tx);
    if (dataToSend == data) {
      this.logger.log(`Successfully send and retrieved data`);
    } else {
      this.logger.log(`Failed to send and retrieve data`);
    }
  }
}
