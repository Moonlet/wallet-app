import { captureException as SentryCaptureException } from '@sentry/react-native';
import { ApiClient } from './api-client';

export class GovernanceApiClient {
    constructor(private apiClient: ApiClient) {}

    public async sendVote(
        payload: {
            address: string;
            msg: string;
            sig: {
                signature: string;
                publicKey: string;
                message: string;
            };
        },
        authorIpfsHash: string
    ) {
        try {
            const response = await this.apiClient.http.post('/governance/sendVote', {
                ...payload,
                authorIpfsHash
            });

            return response?.result;
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }
}
