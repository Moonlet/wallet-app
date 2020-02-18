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

    public async getSymbol(contractAddress) {
        const smartContractInit = await this.getTokenDetails(contractAddress);
        return this.findSmartContractSubField(smartContractInit, 'symbol');
    }

    public async getName(contractAddress) {
        const smartContractInit = await this.getTokenDetails(contractAddress);
        return this.findSmartContractSubField(smartContractInit, 'name');
    }

    public async getDecimals(contractAddress) {
        const smartContractInit = await this.getTokenDetails(contractAddress);
        return this.findSmartContractSubField(smartContractInit, 'decimals');
    }

    public async getTokenInfo(contractAddress) {
        const info = await Promise.all([
            this.getSymbol(contractAddress),
            this.getName(contractAddress),
            this.getDecimals(contractAddress)
        ]);

        return {
            symbol: info[0],
            name: info[1],
            decimals: info[2]
        };
    }

    private async getTokenDetails(contractAddress) {
        const smartContractSubState = await this.client.getSmartContractSubState(
            contractAddress,
            'implementation'
        );

        return this.client.getSmartContractInit(smartContractSubState?.implementation);
    }

    private findSmartContractSubField(smartContractInit, field: string) {
        const object: any = Object.values(smartContractInit).find(
            (info: any) => info.vname === field
        );
        return object?.value;
    }
}
