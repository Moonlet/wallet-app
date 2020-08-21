import { ApiClient } from './api-client';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export class NearApiClient {
    constructor(private apiClient: ApiClient) {}

    public async createAccount(accountId: string, publicKey: string, chainId: string) {
        try {
            return this.apiClient.http.post('/near/createAccount', {
                accountId,
                publicKey,
                chainId,
                timestamp: new Date().getTime()
            });
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
            return err;
        }
    }
}
