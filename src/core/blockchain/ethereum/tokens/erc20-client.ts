import { Client } from '../client';
import BigNumber from 'bignumber.js';
import { IBalance } from '../../types';

export class Erc20Client {
    constructor(private client: Client) {}

    public async getBalance(contractAddress, accountAddress): Promise<IBalance> {
        try {
            const balance = await this.client.callContract(
                contractAddress,
                'balanceOf(address):(uint256)',
                [accountAddress]
            );

            return {
                total: new BigNumber(balance as string) || new BigNumber(0),
                available: new BigNumber(balance as string) || new BigNumber(0)
            };
        } catch {
            return { total: new BigNumber(0), available: new BigNumber(0) };
        }
    }

    public getSymbol(contractAddress) {
        return this.client.callContract(contractAddress, 'symbol():(string)');
    }

    public getName(contractAddress) {
        return this.client.callContract(contractAddress, 'name():(string)');
    }

    public getDecimals(contractAddress) {
        return this.client.callContract(contractAddress, 'decimals():(uint8)');
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
}
