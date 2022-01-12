import {ScenarioInterface} from './scenario-interface';
import Logger from '../services/logger';
import {SubstrateService} from '../services/substrate-service';
import cereTypes from './cere-network-type.json';

export class Scenarios_7 implements ScenarioInterface {
  logger = new Logger(Scenarios_7.name);

  public async run() {
    this.logger.log(`Starting scenario 7...`);

    this.logger.log(`Initializing the blockchain`);
    const service = new SubstrateService();
    await service.initialize(cereTypes);

    const result = [];
    const electedInfo = await service.fetchElectedInfo();
    electedInfo.info.forEach((element) => {
      result.push({validator: element.accountId, nominators: element.exposure.others});
    });
    console.log(`Validator and Nominator: ${JSON.stringify(result)}`);
  }
}
