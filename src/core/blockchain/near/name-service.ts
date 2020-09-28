import {
    IResolveTextResponse,
    IResolveNameResponse,
    ResolveTextType,
    ResolveTextCode
} from '../types';
import { Client as NearClient, Client } from './client';
import { GenericNameService, ResolveTextError } from '../types/name-service';

export class NameService extends GenericNameService {
    constructor(client: Client) {
        super(client);
    }

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
            if (account.valid === false) {
                return Promise.reject({
                    error: ResolveTextError.INVALID
                });
            } else {
                return {
                    address: account.address
                };
            }
        } catch (error) {
            return Promise.reject({
                error: ResolveTextError.CONNECTION_ERROR
            });
        }
    }
}
