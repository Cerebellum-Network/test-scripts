import {SubstrateService} from "../services/substrate-service";
import {ScenarioInterface} from "./scenario-interface";
import Logger from './../services/logger';

export class Scenarios_4 implements ScenarioInterface {
  logger = new Logger(Scenarios_4.name);

  async run() {
    /*
       TODO: Implement Scenario 4 [Restricted Assets]:
         * Create 3 user wallets
         * Sends Restricted Assets to those wallets using issueRestrictedAsset function
     */
    this.logger.log('Scenario 4');
  }
}
