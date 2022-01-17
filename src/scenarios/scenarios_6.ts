import {ScenarioInterface} from "./scenario-interface";
import Logger from "./../services/logger";
import {SubstrateService} from "../services/substrate-service";
import cereTypes from "./cere-network-type.json";
import {Keyring} from "@polkadot/api";
import {KeyringPair} from "@polkadot/keyring/types";
import fs from "fs";
import csv from "csv-parser";

export class Scenarios_6 implements ScenarioInterface {
    logger = new Logger(Scenarios_6.name);

    public async run() {
        this.logger.log(`Starting scenario 6...`);

    }
}
