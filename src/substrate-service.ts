import {u8aToHex} from '@polkadot/util';
import {mnemonicGenerate, mnemonicToMiniSecret} from '@polkadot/util-crypto';
import {Keyring} from '@polkadot/keyring';
import {ContractPromise} from '@polkadot/api-contract';
import {KeyringPair} from '@polkadot/keyring/types';
import {ApiPromise, WsProvider} from '@polkadot/api';
import assetSmartContractAbi from './abi/asset-smart-contract.json';
import {GenerateWalletResponse} from "./model/generate-wallet-response";
import {IssueAssetResponse} from "./model/issue-asset-response";
import {GetBalanceResponse} from './model/get-balance-response';

const MNEMONIC_WORDS_COUNT = 15;

export class SubstrateService {
  private contract: ContractPromise;

  private appKeyring: KeyringPair;

  private substrateApi: ApiPromise;

  public async initialize(): Promise<void> {
    this.substrateApi = await ApiPromise.create({
      provider: new WsProvider(process.env.NODE_URL),
    });

    this.contract = new ContractPromise(this.substrateApi, assetSmartContractAbi, process.env.SMART_CONTRACT_ADDRESS);

    const keyring = new Keyring({type: 'sr25519'});
    this.appKeyring = keyring.addFromJson(JSON.parse(process.env.APP_WALLET_JSON));
    this.appKeyring.decodePkcs8(process.env.APP_WALLET_PASSPHRASE);
  }

  public generateWallet(): GenerateWalletResponse {
    const mnemonic = mnemonicGenerate(MNEMONIC_WORDS_COUNT);

    const keyring = new Keyring({type: 'sr25519', ss58Format: 2});
    const pair = keyring.addFromUri(mnemonic, {}, 'ed25519');

    const publicKey = u8aToHex(pair.publicKey);
    const privateKey = u8aToHex(mnemonicToMiniSecret(mnemonic));

    return new GenerateWalletResponse(publicKey, privateKey, mnemonic);
  }

  public async issueAssetToUser(destinationAccountPublicKey: string, amount: string, fee: string): Promise<IssueAssetResponse> {
    const gasLimitAuto = -1;
    const anyValue = 0;
    const transferObj = await this.contract.tx.transfer(
      anyValue,
      gasLimitAuto,
      destinationAccountPublicKey,
      amount,
      fee,
    );

    return new Promise<IssueAssetResponse>((res, rej) => {
      transferObj
        .signAndSend(this.appKeyring, ({status}) => {
          if (status.isInBlock) {
            console.log('[SUBSTRATE_SERVICE] In block');
          } else if (status.isFinalized) {
            res(new IssueAssetResponse(status.asFinalized.toHex()));
          }
        })
        .catch(err => rej(err));
    });
  }

  public async issueAssetToUserBatch(amount: string, wallets: Array<string>): Promise<IssueAssetResponse> {
    let txs = [];
    for (let i = 0; i < wallets.length; i++) {
      let tx = this.substrateApi.tx.balances.transfer(
        wallets[i],
        amount
      );
      txs.push(tx);
    }

    const transferObj = this.substrateApi.tx.utility.batchAll(txs)
    
    return new Promise<IssueAssetResponse>((res, rej) => {
      transferObj
          .signAndSend(this.appKeyring, ({ status }) => {
            if (status.isInBlock) {
              console.log(`included in ${status.asInBlock}`);
            } else if (status.isFinalized) {
              res(new IssueAssetResponse(status.asFinalized.toHex()));
            }
          })
        .catch(err => rej(err));
    });
  }

  public async getBalance(accountKey: string): Promise<GetBalanceResponse> {
    const gasLimitAuto = -1;
    const anyValue = 0;
    const response = await this.contract.query.balanceOf(
      u8aToHex(this.appKeyring.publicKey),
      anyValue,
      gasLimitAuto,
      accountKey,
    );

    if (response.result.isOk) {
      return new GetBalanceResponse(response.output.toString());
    }

    if (response.result.isErr) {
      throw new Error(JSON.stringify(response.result.asErr));
    }

    throw new Error('Something went wrong!');
  }

  public async getFeeEstimate(destinationAccountPublicKey: string, amount: string): Promise<any> {
    let info = await this.substrateApi.tx.balances.transfer(
      destinationAccountPublicKey,
      amount
    ).paymentInfo(this.appKeyring)
    
    if (info.partialFee) {
      return info.partialFee.toBn();
    }

    if (!info.partialFee) {
      throw new Error("Error estimating fees!");
    }

    throw new Error('Something went wrong!');
  }
}
