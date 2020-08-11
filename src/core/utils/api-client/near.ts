import { ApiClient } from './api-client';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export class NearApiClient {
    constructor(private apiClient: ApiClient) {}

    public async createAccount(accountId: string, publicKey: string, chainId: string) {
        try {
            const response = await this.apiClient.http.post('/near/createAccount', {
                accountId,
                publicKey,
                chainId
            });

            return response?.result?.data;
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }
}
