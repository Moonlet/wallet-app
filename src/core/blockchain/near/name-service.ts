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
        const client = this.client as NearClient;
        const isValidAccount = await client.checkAccountIdValid(text);

        if (isValidAccount) {
            return Promise.resolve({
                code: ResolveTextCode.OK,
                type: ResolveTextType.ADDRESS,
                address: text,
                name: ''
            });
        }
    }

    public async resolveName(text: string): Promise<IResolveNameResponse> {
        return {
            address: text
        };
    }
}
