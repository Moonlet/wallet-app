import { ApiClient } from './api-client';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';
import { Blockchain } from '../../blockchain/types';
import { PosBasicActionType } from '../../blockchain/types/token';
import { IAccountState } from '../../../redux/wallets/state';
import DeviceInfo from 'react-native-device-info';

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
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    blockchain,
                    chainId,
                    address,
                    posAction
                })
            });

            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    public async getAccountDelegateStats(account: IAccountState, chainId: string) {
        try {
            const response = await this.apiClient.http.post('/walletUi/tokenScreen', {
                blockchain: account.blockchain,
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
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    blockchain: account.blockchain,
                    address: account.address,
                    chainId
                })
            });

            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    public async fetchDelegatedValidators(account: IAccountState, chainId: string) {
        try {
            const response = await this.apiClient.http.post('/walletUi/tokenScreen/accountVotes', {
                blockchain: account.blockchain,
                address: account.address,
                chainId
            });

            if (response.result) {
                return response.result.data;
            } else {
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        blockchain: account.blockchain,
                        address: account.address,
                        chainId
                    })
                });

                SentryCaptureException(
                    new Error(JSON.stringify(response || 'Get validators voted failed'))
                );
                return undefined;
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    public async getBalance(
        address: string,
        blockchain: Blockchain,
        chainId: string,
        validatorId?: string
    ) {
        try {
            const response = await this.apiClient.http.post('/walletUi/account/balance', {
                blockchain,
                address,
                chainId,
                appVersion: DeviceInfo.getVersion(),
                validatorId
            });

            if (response.result) {
                return response.result.data;
            } else {
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        blockchain,
                        address,
                        chainId,
                        appVersion: DeviceInfo.getVersion(),
                        validatorId
                    })
                });

                SentryCaptureException(
                    new Error(JSON.stringify(response || 'Get validators voted failed'))
                );
                return undefined;
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }
}
