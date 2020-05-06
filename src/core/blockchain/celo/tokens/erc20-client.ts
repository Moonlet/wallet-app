import { Client } from '../client';
import BigNumber from 'bignumber.js';

export class Erc20Client {
    constructor(private client: Client) {}

    public getBalance(contractAddress, accountAddress): Promise<BigNumber> {
        return this.client
            .callContract(contractAddress, 'balanceOf(address):(uint256)', [accountAddress])
            .then(v => new BigNumber(v as string));
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
