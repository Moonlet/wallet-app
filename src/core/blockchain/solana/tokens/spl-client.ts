import { Client } from '../client';
import BigNumber from 'bignumber.js';
import { IBalance } from '../../types';

export class SplClient {
    constructor(private client: Client) {}

    public async getBalance(contractAddress: string, accountAddress: string): Promise<IBalance> {
        try {
            // getTokenAccountBalance

            const balanceRes = await this.client.http.jsonRpc('getTokenAccountsByOwner', [
                accountAddress,
                {
                    mint: contractAddress
                },
                {
                    encoding: 'jsonParsed'
                }
            ]);

            // associated token account and/or other ancillary token accounts

            const balance = String(
                (balanceRes?.result?.value &&
                    balanceRes?.result?.value[0] &&
                    balanceRes?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount
                        ?.amount) ||
                    0
            );

            return {
                total: new BigNumber(balance),
                available: new BigNumber(balance)
            };
        } catch (error) {
            return {
                total: new BigNumber(0),
                available: new BigNumber(0)
            };
        }
    }

    public async isActive(contractAddress: string, accountAddress: string): Promise<boolean> {
        try {
            const balanceRes = await this.client.http.jsonRpc('getTokenAccountsByOwner', [
                accountAddress,
                {
                    mint: contractAddress
                },
                {
                    encoding: 'jsonParsed'
                }
            ]);

            return (
                balanceRes?.result?.value &&
                Array.isArray(balanceRes.result.value) &&
                balanceRes.result.value.length >= 1
            );
        } catch (error) {
            throw error;
        }
    }
}
