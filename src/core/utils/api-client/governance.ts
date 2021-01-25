import { captureException as SentryCaptureException } from '@sentry/react-native';
import { Blockchain } from '../../blockchain/types';
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
        authorIpfsHash: string,
        user: {
            blockchain: Blockchain;
            chainId: string;
        }
    ) {
        try {
            const response = await this.apiClient.http.post('/governance/sendVote', {
                ...payload,
                authorIpfsHash,
                user
            });

            return response?.result;
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }
}
