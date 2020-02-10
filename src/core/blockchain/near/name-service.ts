import {
    IResolveTextResponse,
    IResolveNameResponse,
    ResolveTextType,
    ResolveTextCode
} from '../types';
import { Client as NearClient, Client } from './client';

export class NameService {
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
            return Promise.reject();
        }
    }

    public async resolveName(text: string): Promise<IResolveNameResponse> {
        const client = this.client as NearClient;

        try {
            return await client.accountExists(text);
        } catch (error) {
            return Promise.reject();
        }
    }
}
