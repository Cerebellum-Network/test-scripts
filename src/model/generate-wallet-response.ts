export class GenerateWalletResponse {
  public constructor(public readonly publicKey: string, public readonly privateKey: string, public readonly mnemonic: string) {}
}
