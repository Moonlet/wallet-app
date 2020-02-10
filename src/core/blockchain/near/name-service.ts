import {
    IResolveTextResponse,
    IResolveNameResponse,
    ResolveTextType,
    ResolveTextCode
} from '../types';
import { Client as NearClient, Client } from './client';
import { IBlockchainNameService, ResolveTextError } from '../types/name-service';

export class NameService implements IBlockchainNameService {
    constructor(private client: Client) {}

    public async resolveText(text: string): Promise<IResolveTextResponse> {
        try {
            const accountValid = await this.resolveName(text);
            return {
                code: ResolveTextCode.OK,
                type: ResolveTextType.NAME,
                address: accountValid.address,
                name: ''
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async resolveName(text: string): Promise<IResolveNameResponse> {
        const client = this.client as NearClient;

        try {
            const account = await client.getAccount(text);
            return {
                address: account.address
            };
        } catch (error) {
            return Promise.reject({
                error: ResolveTextError.CONNECTION_ERROR
            });
        }
    }
}
