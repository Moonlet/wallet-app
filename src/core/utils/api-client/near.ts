import { ApiClient } from './api-client';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export class NearApiClient {
    constructor(private apiClient: ApiClient) {}

    public async createAccount(
        name: string,
        extension: string,
        publicKey: string,
        chainId: string
    ) {
        try {
            return this.apiClient.http.post('/near/createAccount', {
                name,
                extension,
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
