import {u8aToHex} from "@polkadot/util";
import {mnemonicGenerate, mnemonicToMiniSecret} from "@polkadot/util-crypto";
import {Keyring} from "@polkadot/keyring";
import {ContractPromise} from "@polkadot/api-contract";
import {KeyringPair} from "@polkadot/keyring/types";
import {ApiPromise, WsProvider} from "@polkadot/api";
import assetSmartContractAbi from "../abi/asset-smart-contract.json";
import {GenerateWalletResponse} from "../model/generate-wallet-response";
import {IssueAssetResponse} from "../model/issue-asset-response";
import {GetBalanceResponse} from "../model/get-balance-response";
import {IssueRestrictiveTime} from "../model/restrictive-asset-time";
import Logger from "./../services/logger";
import {blake2AsU8a} from "@polkadot/util-crypto";
import {GenericEventData} from "@polkadot/types";

const MNEMONIC_WORDS_COUNT = 15;

export interface ISanitizedEvent {
  method: string;
  data: GenericEventData;
}
export class SubstrateService {
  private logger = new Logger(SubstrateService.name);

  private contract: ContractPromise;

  private appKeyring: KeyringPair;

  private substrateApi: ApiPromise;

  public async initialize(customTypes?): Promise<void> {
    if (customTypes) {
      this.substrateApi = await ApiPromise.create({
        provider: new WsProvider(process.env.NODE_URL),
        types: customTypes,
      });
    } else {
      this.substrateApi = await ApiPromise.create({
        provider: new WsProvider(process.env.NODE_URL),
      });
    }
    await this.substrateApi.isReady;
  }

  public initializeSmartContract() {
    this.contract = new ContractPromise(
        this.substrateApi,
        assetSmartContractAbi,
        process.env.SMART_CONTRACT_ADDRESS
    );
  }

  public initializeKeyring() {
    const keyring = new Keyring({ type: "sr25519" });
    this.appKeyring = keyring.addFromJson(
        JSON.parse(process.env.APP_WALLET_JSON)
    );
    this.appKeyring.decodePkcs8(process.env.APP_WALLET_PASSPHRASE);
    console.log(this.appKeyring.address);
  }

  public generateWallet(): GenerateWalletResponse {
    const mnemonic = mnemonicGenerate(MNEMONIC_WORDS_COUNT);

    const keyring = new Keyring({ type: "sr25519", ss58Format: 2 });
    const pair = keyring.addFromUri(mnemonic, {}, "ed25519");

    const publicKey = u8aToHex(pair.publicKey);
    const privateKey = u8aToHex(mnemonicToMiniSecret(mnemonic));

    return new GenerateWalletResponse(publicKey, privateKey, mnemonic);
  }

  public async issueAssetToUser(
    destinationAccountPublicKey: string,
    amount: string,
    fee: string
  ): Promise<IssueAssetResponse> {
    const gasLimitAuto = -1;
    const anyValue = 0;
    const transferObj = await this.contract.tx.transfer(
      anyValue,
      gasLimitAuto,
      destinationAccountPublicKey,
      amount,
      fee
    );

    return new Promise<IssueAssetResponse>((res, rej) => {
      transferObj
        .signAndSend(this.appKeyring, ({ status }) => {
          if (status.isInBlock) {
            const hash = status.asInBlock.toHex();
            this.logger.log(`In block: ${hash}`);
            res(new IssueAssetResponse(hash));
          }
        })
        .catch((err) => rej(err));
    });
  }

  public async issueAssetToUserBatch(
    amount: string,
    wallets: Array<string>
  ): Promise<IssueAssetResponse> {
    let txs = [];
    for (let i = 0; i < wallets.length; i++) {
      let tx = this.substrateApi.tx.balances.transfer(wallets[i], amount);
      txs.push(tx);
    }

    const transferObj = this.substrateApi.tx.utility.batchAll(txs);

    return new Promise<IssueAssetResponse>((res, rej) => {
      transferObj
        .signAndSend(this.appKeyring, ({ status }) => {
          if (status.isInBlock) {
            this.logger.log(`included in ${status.asInBlock}`);
          } else if (status.isFinalized) {
            res(new IssueAssetResponse(status.asFinalized.toHex()));
          }
        })
        .catch((err) => rej(err));
    });
  }

  public async getBalance(accountKey: string): Promise<GetBalanceResponse> {
    const gasLimitAuto = -1;
    const anyValue = 0;
    const response = await this.contract.query.balanceOf(
      u8aToHex(this.appKeyring.publicKey),
      anyValue,
      gasLimitAuto,
      accountKey
    );

    if (response.result.isOk) {
      return new GetBalanceResponse(response.output.toString());
    }

    if (response.result.isErr) {
      throw new Error(JSON.stringify(response.result.asErr));
    }

    throw new Error("Something went wrong!");
  }

  public async getFeeEstimate(
    destinationAccountPublicKey: string,
    amount: string
  ): Promise<any> {
    let info = await this.substrateApi.tx.balances
      .transfer(destinationAccountPublicKey, amount)
      .paymentInfo(this.appKeyring);

    if (info.partialFee) {
      return info.partialFee.toBn();
    }

    if (!info.partialFee) {
      throw new Error("Error estimating fees!");
    }

    throw new Error("Something went wrong!");
  }

  public async issueRestritiveAsset(
    destination: string,
    amount: string,
    timeLimit: string,
    fee: string
  ): Promise<IssueAssetResponse> {
    const gasLimitAuto = -1;
    const anyValue = 0;
    const transferObj = await this.contract.tx.issueRestrictedAsset(
      anyValue,
      gasLimitAuto,
      destination,
      amount,
      true,
      timeLimit,
      fee
    );

    return new Promise<IssueAssetResponse>((res, rej) => {
      transferObj
        .signAndSend(this.appKeyring, ({ status }) => {
          if (status.isInBlock) {
            const hash = status.asInBlock.toHex();
            this.logger.log(`In block: ${hash}`);
            res(new IssueAssetResponse(hash));
          }
        })
        .catch((err) => rej(err));
    });
  }

  public async getRestritiveTime(
    address: string
  ): Promise<IssueRestrictiveTime> {
    const gasLimitAuto = -1;
    const anyValue = 0;
    const response = await this.contract.query.getIssueRestrictiveAsset(
      u8aToHex(this.appKeyring.publicKey),
      anyValue,
      gasLimitAuto,
      address
    );

    if (response.result.isOk) {
      return new IssueRestrictiveTime(response.output.toString());
    }

    if (response.result.isErr) {
      throw new Error(JSON.stringify(response.result.asErr));
    }

    throw new Error("Something went wrong!");
  }

  public async sendData(
    destination: string,
    data: string
  ): Promise<IssueAssetResponse> {
    let txnObj = await this.substrateApi.tx.cereDdcModule.sendData(
      destination,
      data
    );
    return new Promise<IssueAssetResponse>((res, rej) => {
      txnObj
        .signAndSend(this.appKeyring, ({ status }) => {
          if (status.isInBlock) {
            const hash = status.asInBlock.toHex();
            this.logger.log(`In block: ${hash}`);
            res(new IssueAssetResponse(hash));
          }
        })
        .catch((err) => rej(err));
    });
  }

  public async retrieveData(blockHash: string): Promise<any> {
    const { extrinsics } = await this.fetchBlockData(blockHash);
    return new Promise((resolve, reject) => {
      extrinsics.forEach((transaction) => {
        if (transaction.method === "cereDdcModule.sendData") {
          let data: string = transaction.args[1].toString();
          const convert = (from, to) => (str) =>
            Buffer.from(str, from).toString(to);
          const hexToUtf8 = convert("hex", "utf8");
          data = hexToUtf8(data.substring(2));
          resolve(data);
        }
      });
    });
  }

  public async fetchBlockData(blockHash: string): Promise<any> {
    const [{ block }, events] = await Promise.all([
      this.substrateApi.rpc.chain.getBlock(blockHash),
      this.substrateApi.query.system.events.at(blockHash),
    ]);

    const { parentHash, number, stateRoot, extrinsicsRoot } = block.header;
    const onInitialize = { events: [] as ISanitizedEvent[] };
    const onFinalize = { events: [] as ISanitizedEvent[] };

    const header = await this.substrateApi.derive.chain.getHeader(blockHash);
    const authorId = header?.author;

    const logs = block.header.digest.logs.map((log) => {
      const { type, index, value } = log;

      return { type, index, value };
    });

    const defaultSuccess = typeof events === 'string' ? events : false;
    const extrinsics = block.extrinsics.map((extrinsic) => {
      const {
        method,
        nonce,
        signature,
        signer,
        isSigned,
        tip,
        args
      } = extrinsic;
      const hash = u8aToHex(blake2AsU8a(extrinsic.toU8a(), 256));

      return {
        method: `${method.section}.${method.method}`,
        signature: isSigned ? { signature, signer } : null,
        nonce,
        args,
        tip,
        hash,
        info: {},
        events: [] as ISanitizedEvent[],
        success: defaultSuccess,
        // paysFee overrides to bool if `system.ExtrinsicSuccess|ExtrinsicFailed` event is present
        paysFee: null as null | boolean,
      };
    });

    const successEvent = 'system.ExtrinsicSuccess';
    const failureEvent = 'system.ExtrinsicFailed';

    if (Array.isArray(events)) {
      for (const record of events) {
        const { event, phase } = record;
        const sanitizedEvent = {
          method: `${event.section}.${event.method}`,
          data: event.data,
        };

        if (phase.isApplyExtrinsic) {
          const extrinsicIdx = phase.asApplyExtrinsic.toNumber();
          const extrinsic = extrinsics[extrinsicIdx];

          if (!extrinsic) {
            console.error(`Block ${block.header.number.toNumber()} ${blockHash}: Missing extrinsic ${extrinsicIdx}`);
            continue;
          }

          const method = `${event.section}.${event.method}`;

          if (method === successEvent) {
            extrinsic.success = true;
          }

          if (method === successEvent || method === failureEvent) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sanitizedData = event.data.toJSON() as any[];

            for (const data of sanitizedData) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (data && data.paysFee) {
                extrinsic.paysFee =
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  data.paysFee === true ||
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  data.paysFee === 'Yes';

                break;
              }
            }
          }

          extrinsic.events.push(sanitizedEvent);
        } else if (phase.isFinalization) {
          onFinalize.events.push(sanitizedEvent);
        } else if (phase.isInitialization) {
          onInitialize.events.push(sanitizedEvent);
        }
      }
    }

    return {
      number,
      blockHash,
      parentHash,
      stateRoot,
      extrinsicsRoot,
      authorId,
      logs,
      onInitialize,
      extrinsics,
      onFinalize,
    };
  }

  public async transfer(from: KeyringPair, to: string, value: number) {
    const { nonce } = await this.substrateApi.query.system.account(from.address);
    return new Promise((resolve, reject) => {
      this.substrateApi.tx.balances
          .transfer(to, value)
          .signAndSend(from, { nonce }, ({ status }) => {
            if (status.isInBlock) {
              this.logger.log(`Included in ${status.asInBlock}`);
              resolve(status.asInBlock.toHex());
            } else if (status.isFinalized) {
              this.logger.log(`The transaction is Finalized ${status.asFinalized}`);
            }
          })
          .catch((err) => reject(err));
    });
  }

  public async fetchValidatorsAndNominatorsInfo(eraIndex) {
    const info = await this.substrateApi.derive.staking.eraExposure(eraIndex);
    return info;
  }

  public async fetchBlockHash(blockNumber) {
    const blockHash = await this.substrateApi.rpc.chain.getBlockHash(blockNumber);
    return blockHash
  }

  public async fetchEraPoints(eraIndex) {
    const eraPoints = await this.substrateApi.query.staking.erasRewardPoints(eraIndex);
    return eraPoints
  }
}
