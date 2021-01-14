import {u8aToHex} from '@polkadot/util';
import {mnemonicGenerate, mnemonicToMiniSecret} from '@polkadot/util-crypto';
import {Keyring} from '@polkadot/keyring';
import {ContractPromise} from '@polkadot/api-contract';
import {KeyringPair} from '@polkadot/keyring/types';
import {ApiPromise, WsProvider} from '@polkadot/api';
import assetSmartContractAbi from './abi/asset-smart-contract.json';

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

  public generateWallet(): any {
    const mnemonic = mnemonicGenerate(MNEMONIC_WORDS_COUNT);

    const keyring = new Keyring({type: 'sr25519', ss58Format: 2});
    const pair = keyring.addFromUri(mnemonic, {}, 'ed25519');

    const publicKey = u8aToHex(pair.publicKey);
    const privateKey = u8aToHex(mnemonicToMiniSecret(mnemonic));

    return {publicKey, privateKey, mnemonic};
  }

  public async issueAssetToUser(destinationAccountPublicKey: string, amount: string, fee: string): Promise<any> {
    const gasLimitAuto = -1;
    const anyValue = 0;
    const transferObj = await this.contract.tx.transfer(
      anyValue,
      gasLimitAuto,
      destinationAccountPublicKey,
      amount,
      fee,
    );

    return new Promise((res, rej) => {
      transferObj
        .signAndSend(this.appKeyring, ({status}) => {
          if (status.isInBlock) {
            console.log('In block');
          } else if (status.isFinalized) {
            res(status.asFinalized.toHex());
          }
        })
        .catch(err => rej(err));
    });
  }
}
