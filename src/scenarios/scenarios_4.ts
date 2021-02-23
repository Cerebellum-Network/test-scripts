import { SubstrateService } from "../services/substrate-service";
import { ScenarioInterface } from "./scenario-interface";
import Logger from "./../services/logger";

export class Scenarios_4 implements ScenarioInterface {
  logger = new Logger(Scenarios_4.name);

  async run() {
    this.logger.log("Creating SubstrateService instance scenario 4...");

    const service = new SubstrateService();
    await service.initialize();

    this.logger.log(
      `SubstrateService instance has been created and initialized successfully`
    );

    // Generating Wallets
    this.logger.log("Generating wallet...");
    const alice = service.generateWallet();
    this.logger.log(
      `Wallet has been generated successfully. Value is ${JSON.stringify(
        alice
      )}`
    );

    const balance = await service.getBalance("5FCH5cKaSTBUB4e3q2m6XBqtJZiymJtvU4t8ASPp2SzuxGgn");
    this.logger.log(`Balance is: ${JSON.stringify(balance)}`);

    const result = await service.issueRestritiveAsset(
      alice.publicKey,
      "10",
      "10",
      "0"
    );
    this.logger.log(
      `Issuing assets to user has been completed successfully. Result is ${JSON.stringify(
        result
      )}`
    );

    const time = await service.getRestritiveTime(alice.publicKey);
    this.logger.log(`Time limit: ${JSON.stringify(time)}`);
  }
}
