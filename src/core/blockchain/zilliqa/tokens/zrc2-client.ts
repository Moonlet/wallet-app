import { Client } from '../client';
import BigNumber from 'bignumber.js';
import { fromBech32Address } from '@zilliqa-js/crypto';

export class Zrc2Client {
    constructor(private client: Client) {}

    public getBalance(contractAddress, accountAddress): Promise<BigNumber> {
        const address = fromBech32Address(accountAddress).toLowerCase();
        return this.client.rpc
            .call('GetSmartContractSubState', [
                fromBech32Address(contractAddress)
                    .replace('0x', '')
                    .toLowerCase(),
                'balances',
                [address]
            ])
            .then(response => (response?.result?.balances || {})[address] || 0)
            .then(v => new BigNumber(v as string));
    }

    // TODO do implementation
    // public getSymbol(contractAddress) {
    //     return this.client.callContract(contractAddress, 'symbol():(string)');
    // }

    // TODO do implementation
    // public getName(contractAddress) {
    //     return this.client.callContract(contractAddress, 'name():(string)');
    // }

    // TODO do implementation
    // public getDecimals(contractAddress) {
    //     return this.client.callContract(contractAddress, 'decimals():(uint8)');
    // }

    // TODO do implementation
    // public async getTokenInfo(contractAddres) {
    //     const info = await Promise.all([
    //         this.getSymbol(contractAddres),
    //         this.getName(contractAddres),
    //         this.getDecimals(contractAddres)
    //     ]);

    //     return {
    //         symbol: info[0],
    //         name: info[1],
    //         decimals: info[2]
    //     };
    // }
}
