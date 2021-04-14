import {SubstrateService} from "../services/substrate-service";
import {ScenarioInterface} from "./scenario-interface";
import Logger from './../services/logger';

export class Scenarios_6 implements ScenarioInterface {
    logger = new Logger(Scenarios_6.name);

    async run() {
        this.logger.log('Creating SubstrateService instance...');

        const service = new SubstrateService();
        await service.initialize();


    }
}
