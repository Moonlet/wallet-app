import EthApp from '@ledgerhq/hw-app-eth';
import { IHardwareWalletApp } from '../types';

export class Eth implements IHardwareWalletApp {
    private app: EthApp;
    constructor(transport) {
        this.app = new EthApp(transport);
    }

    public getPath(index, derivationIndex, path) {
        switch (path) {
            case 'legacy':
                return `44'/60'/${index}'/${derivationIndex}`;
            case 'live':
            default:
                return `44'/60'/${index}'/0/${derivationIndex}`;
        }
    }

    /**
     * @param {number} index index of account
     * @param {number} derivationIndex index of derivation for an account
     * @param {number} path derivation path, values accepted: live, legacy
     */
    public getAddress(index: number, derivationIndex: number = 0, path: string) {
        return this.app.getAddress(this.getPath(index, derivationIndex, path), true);
    }

    public signTransaction({ index, derivationIndex, path, txRaw }) {
        return this.app.signTransaction(this.getPath(index, derivationIndex, path), txRaw);
    }

    public getInfo() {
        return this.app.getAppConfiguration();
    }
}
