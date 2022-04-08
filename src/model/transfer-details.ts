import BN from "bn.js";

export class TransferDetails {
    public constructor(public readonly destinationAddress: string, public readonly amount: BN) {
    }
}
