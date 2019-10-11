import { IAccountState } from '../../redux/state';

export abstract class GenericBlockchain {
    public readonly DERIVATION_PATH: string = '';

    private networkId: number;

    constructor(networkId?: number) {
        this.networkId = networkId || 1; // 1 is generally mainnet
    }

    public abstract getAccountFromPrivateKey(privateKey: string, index: number): IAccountState;
    public abstract getBalance(address: string): Promise<any>;
    public abstract sendTransaction(): Promise<any>;

    public rpcCall(method: string, params: any[]): Promise<any> {
        return Promise.resolve();
    }
}
