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

        const service = new SubstrateService();
        await service.initialize(cereTypes);

        const faucet = this.getFaucetKeyringPair(process.env.FAUCET_MNEMONIC);
        const transferAmount = this.getTransferAmount();
        const addresses = await this.getAddresses();

        this.logger.log(`Got ${addresses.length} addresses`);

        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];
            this.logger.log(`About to transfer tokens to '${address}' ${i+1} out of ${addresses.length}...`);
            try {
                await service.transfer(faucet, address, transferAmount);

                this.logger.log(`Successfully transferred tokens to '${address}'`);
            } catch (e) {
                this.logger.error(e);
            }
        }
    }

    private getFaucetKeyringPair(mnemonic): KeyringPair {
        const keyring = new Keyring({ type: "sr25519" });
        const pair = keyring.addFromUri(mnemonic);
        return pair;
    }

    private getTransferAmount(): number {
        return (+process.env.FAUCET_TRANSFER_AMOUNT) * 10**10;
    }

    private getAddresses(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const addresses: string[] = [];
            fs.createReadStream(process.env.ADDRESSES_FILE_PATH)
                .pipe(csv())
                .on('data', (data) => {
                    addresses.push(data['accounts']);
                })
                .on('end', () => resolve(addresses))
                .on('error', e => reject(e))
        });
    }
}
