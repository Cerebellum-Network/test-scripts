import {ScenarioInterface} from "./scenario-interface";
import Logger from "../services/logger";
import {SubstrateService} from "../services/substrate-service";
import cereTypes from "./cere-network-type.json";
import {Keyring} from "@polkadot/keyring";

export class Scenarios_9 implements ScenarioInterface {
    logger = new Logger(Scenarios_9.name);

    public async run(): Promise<void> {
        const service = new SubstrateService();
        await service.initialize(cereTypes);

        const keyring = new Keyring({ type: 'sr25519' });
        const mnemonic = '';
        const keyringPair = keyring.addFromMnemonic(mnemonic);
        const to = '';
        const trx = await service.generateOfflineTransferTrx(keyringPair, to, 10000000000);

        this.logger.log(`Trx to send is ${trx}`);
    }
}
