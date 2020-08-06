import { ApiClient } from './api-client';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { Blockchain } from '../../blockchain/types';
import { PosBasicActionType } from '../../blockchain/types/token';
import { IAccountState } from '../../../redux/wallets/state';

export class ValidatorsApiClient {
    constructor(private apiClient: ApiClient) {}

    public async fetchValidators(
        blockchain: Blockchain,
        chainId: string,
        address: string,
        posAction: PosBasicActionType
    ) {
        try {
            const response = await this.apiClient.http.post('/walletUi/validators/list', {
                blockchain,
                chainId,
                address,
                posAction
            });

            return response?.result?.data;
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    public async getAccountDelegateStats(account: IAccountState, chainId: string) {
        try {
            const response = await this.apiClient.http.post('/walletUi/tokenScreen', {
                blockchain: Blockchain.CELO,
                address: account.address,
                chainId
            });

            if (response.result) {
                return response.result.data;
            } else {
                SentryCaptureException(
                    new Error(JSON.stringify(response || 'Get delegate stats failed'))
                );
                return undefined;
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }
}
