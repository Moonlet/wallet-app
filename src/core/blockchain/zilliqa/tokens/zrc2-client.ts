import { Client } from '../client';
import BigNumber from 'bignumber.js';
import { fromBech32Address } from '@zilliqa-js/crypto';
import { IBalance } from '../../types';

export class Zrc2Client {
    constructor(private client: Client) {}

    public async getBalance(contractAddress: string, accountAddress: string): Promise<IBalance> {
        const address = fromBech32Address(accountAddress).toLowerCase();

        try {
            const smartContractSubState = await this.client.getSmartContractSubState(
                contractAddress,
                'balances',
                [address]
            );

            const balance = (smartContractSubState?.balances || {})[address] || 0;

            return {
                total: new BigNumber(balance as string) || new BigNumber(0),
                available: new BigNumber(balance as string) || new BigNumber(0)
            };
        } catch {
            return { total: new BigNumber(0), available: new BigNumber(0) };
        }
    }

    public async getSymbol(contractAddress) {
        const info = await this.getTokenInfo(contractAddress);
        return info.symbol;
    }

    public async getName(contractAddress) {
        const info = await this.getTokenInfo(contractAddress);
        return info.name;
    }

    public async getDecimals(contractAddress) {
        const info = await this.getTokenInfo(contractAddress);
        return info.decimals;
    }

    public async getTokenInfo(contractAddress) {
        const smartContractSubState = await this.client.getSmartContractSubState(
            contractAddress,
            'implementation'
        );

        const smartContractInit = await this.client.getSmartContractInit(
            smartContractSubState?.implementation
        );

        return {
            symbol: this.findSmartContractSubField(smartContractInit, 'symbol').toUpperCase(),
            name: this.findSmartContractSubField(smartContractInit, 'name'),
            decimals: this.findSmartContractSubField(smartContractInit, 'decimals')
        };
    }

    public extractEventParamsValue(
        params: { type: string; value: string; vname: string }[],
        paramName: string
    ) {
        return params.find(paramOjb => paramOjb.vname === paramName)?.value || '';
    }

    private findSmartContractSubField(smartContractInit, field: string) {
        const object: any = Object.values(smartContractInit).find(
            (info: any) => info.vname === field
        );
        return object?.value;
    }
}
