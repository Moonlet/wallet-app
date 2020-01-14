import { Client } from '../client';

export class Erc20Client {
    constructor(private client: Client) {}

    public getBalance(contractAddress, accountAddress) {
        return this.client.callContract(contractAddress, 'balanceOf(address):(uint256)', [
            accountAddress
        ]);
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

    public async getTokenInfo(contractAddres) {
        const info = await Promise.all([
            this.getSymbol(contractAddres),
            this.getName(contractAddres),
            this.getDecimals(contractAddres)
        ]);

        return {
            symbol: info[0],
            name: info[1],
            decimals: info[2]
        };
    }
}
