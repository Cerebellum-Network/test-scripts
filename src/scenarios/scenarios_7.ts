import {ScenarioInterface} from "./scenario-interface";
import Logger from "./../services/logger";
import {SubstrateService} from "../services/substrate-service";
import cereTypes from "./cere-network-type.json";

export class Scenarios_7 implements ScenarioInterface {
    logger = new Logger(Scenarios_7.name);

    public async run() {
        this.logger.log(`Starting scenario 7...`);

        const service = new SubstrateService();
        await service.initialize(cereTypes);

        const blockHash = `0x24acfe8d1cee10728354c109b185dcb8df064f540882d020e993171cb5775688`;

        try {
            const data = await service.fetchBlockData(blockHash);

            this.logger.log(`Successfully fetched block '${blockHash}' '${JSON.stringify(data)}'`);
        } catch (e) {
            this.logger.error(e);
        }

        await service.updateMeta(blockHash);

        try {
            const data = await service.fetchBlockData(blockHash);

            this.logger.log(`Successfully fetched block '${blockHash}' '${JSON.stringify(data)}'`);
        } catch (e) {
            this.logger.error(e);
        }
    }
}
