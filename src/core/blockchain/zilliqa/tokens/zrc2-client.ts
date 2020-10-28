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

    public async getTokenInfo(proxyContractAddress) {
        const proxyContractInit = await this.client.getSmartContractInit(proxyContractAddress);

        let symbol = this.findSmartContractSubField(proxyContractInit, 'symbol')?.toUpperCase();
        let name = this.findSmartContractSubField(proxyContractInit, 'name');
        let decimals = this.findSmartContractSubField(proxyContractInit, 'decimals');

        if (!symbol || !name || !decimals) {
            const smartContractSubState = await this.client.getSmartContractSubState(
                proxyContractAddress,
                'implementation'
            );

            const contractInit = await this.client.getSmartContractInit(
                smartContractSubState?.implementation
            );

            symbol =
                symbol || this.findSmartContractSubField(contractInit, 'symbol')?.toUpperCase();
            name = name || this.findSmartContractSubField(contractInit, 'name');
            decimals = decimals || this.findSmartContractSubField(contractInit, 'decimals');
        }
        // console.log({contractAddress, smartContractSubState, smartContractInit})

        return {
            symbol,
            name,
            decimals
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
