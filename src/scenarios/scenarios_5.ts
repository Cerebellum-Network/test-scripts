import {SubstrateService} from "../services/substrate-service";
import {ScenarioInterface} from "./scenario-interface";
import Logger from './../services/logger';

export class Scenarios_5 implements ScenarioInterface {
  logger = new Logger(Scenarios_5.name);

  async run() {
    /*
       TODO: Implement Scenario 5 [Send Data Transaction]:
         * Create 3 user wallets
         * Sends Data transaction for each account
     */
    this.logger.log('Scenario 5');
  }
}
