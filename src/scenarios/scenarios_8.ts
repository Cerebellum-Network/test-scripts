import {ScenarioInterface} from "./scenario-interface";
import Logger from "../services/logger";
import {SubstrateService} from "../services/substrate-service";
import cereTypes from "./cere-network-type.json";
import {Keyring} from "@polkadot/keyring";
import fs from "fs";
import csv from "csv-parser";
import {TransferDetails} from "../model/transfer-details";
import BN from "bn.js";

const CERE_DECIMALS = 10;

export class Scenarios_8 implements ScenarioInterface {
    logger = new Logger(Scenarios_8.name);

    public async run(): Promise<void> {
        const service = new SubstrateService();
        await service.initialize(cereTypes);

        const keyring = new Keyring({ type: "sr25519" });
        const keyringPair = keyring.addFromMnemonic(process.env.SIGNATORY_1_MNEMONIC);
        const transferDetails = await this.getTransfersDetails();
        const multisig = {threshold: 2, otherSignatoriesPublicKeys: [process.env.SIGNATORY_2_PUBLIC_KEY, process.env.SIGNATORY_3_PUBLIC_KEY]};

        await service.sendTokensInBatchAndSignWithMultisig(keyringPair, transferDetails, multisig);
    }

    private getTransfersDetails(): Promise<TransferDetails[]> {
        return new Promise<TransferDetails[]>((resolve, reject) => {
            const transfersDetails: TransferDetails[] = [];
            fs.createReadStream(process.env.TOKENS_DISTRIBUTION_FILE_PATH)
                .pipe(csv())
                .on('data', (data) => {
                    const transferDetails = new TransferDetails(data.account, this.convertNumberToBN(data.amount));
                    console.log(transferDetails);
                    transfersDetails.push(transferDetails);
                    return;
                })
                .on('end', () => resolve(transfersDetails))
                .on('error', e => reject(e))
        });
    }

    private convertNumberToBN(numberAsString: string): BN {
        const splitted = numberAsString.split('.');
        console.log(splitted);
        let decimalsAsString = splitted[1];
        if (!decimalsAsString) {
            decimalsAsString = '';
        }
        while (decimalsAsString.length < CERE_DECIMALS) {
            decimalsAsString = decimalsAsString.concat('0');
        }
        let cereDecimals = new BN(10);
        let cereDecimalsPower = new BN(CERE_DECIMALS);
        cereDecimals = cereDecimals.pow(cereDecimalsPower);
        let amount = new BN(splitted[0].replace(',', ''));
        amount = amount.mul(cereDecimals);
        const decimalsAsBN = new BN(decimalsAsString);
        return amount.add(decimalsAsBN);
    }
}
