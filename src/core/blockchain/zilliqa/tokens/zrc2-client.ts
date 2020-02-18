import { Client } from '../client';
import BigNumber from 'bignumber.js';
import { fromBech32Address } from '@zilliqa-js/crypto';

export class Zrc2Client {
    constructor(private client: Client) {}

    public async getBalance(contractAddress: string, accountAddress: string): Promise<BigNumber> {
        const address = fromBech32Address(accountAddress).toLowerCase();

        const smartContractSubState = await this.client.getSmartContractSubState(
            contractAddress,
            'balances',
            [address]
        );

        const balance = (smartContractSubState?.balances || {})[address] || 0;
        return new BigNumber(balance as string);
    }

    public getSymbol(smartContractInit) {
        return this.findSmartContractSubField(smartContractInit, 'symbol');
    }

    public getName(smartContractInit) {
        return this.findSmartContractSubField(smartContractInit, 'name');
    }

    public getDecimals(smartContractInit) {
        return this.findSmartContractSubField(smartContractInit, 'decimals');
    }

    public async getTokenInfo(contractAddress: string) {
        const smartContractSubState = await this.client.getSmartContractSubState(
            contractAddress,
            'implementation'
        );

        const smartContractInit = await this.client.getSmartContractInit(
            smartContractSubState?.implementation
        );

        const info = await Promise.all([
            this.getSymbol(smartContractInit),
            this.getName(smartContractInit),
            this.getDecimals(smartContractInit)
        ]);

        return {
            symbol: info[0],
            name: info[1],
            decimals: info[2]
        };
    }

    private findSmartContractSubField(smartContractInit, field: string) {
        const object: any = Object.values(smartContractInit).find(
            (info: any) => info.vname === field
        );
        return object?.value;
    }
}
