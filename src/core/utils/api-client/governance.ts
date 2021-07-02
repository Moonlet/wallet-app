import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';
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
        } catch (error) {
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    data: {
                        ...payload,
                        authorIpfsHash,
                        user
                    },
                    error
                })
            });

            SentryCaptureException(new Error(`Cannot send governance vote, ${error?.message}`));
        }
    }
}
