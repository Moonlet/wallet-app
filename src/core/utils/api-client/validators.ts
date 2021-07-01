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
        } catch (error) {
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    data: {
                        blockchain,
                        chainId,
                        address,
                        posAction
                    },
                    error
                })
            });

            SentryCaptureException(new Error(`Cannot fetch validators, ${error?.message}`));
        }
    }

    public async getAccountDelegateStats(account: IAccountState, chainId: string) {
        try {
            const response = await this.apiClient.http.post('/walletUi/tokenScreen', {
                blockchain: account.blockchain,
                address: account.address,
                chainId
            });

            if (response?.result?.data) {
                return response.result.data;
            } else {
                SentryCaptureException(
                    new Error(`Cannot fetch account delegate stats, no response data`)
                );
                return undefined;
            }
        } catch (error) {
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    data: {
                        blockchain: account.blockchain,
                        address: account.address,
                        chainId
                    },
                    error
                })
            });

            SentryCaptureException(
                new Error(`Cannot fetch account delegate stats, ${error?.message}`)
            );
        }
    }

    public async fetchDelegatedValidators(account: IAccountState, chainId: string) {
        try {
            const response = await this.apiClient.http.post('/walletUi/tokenScreen/accountVotes', {
                blockchain: account.blockchain,
                address: account.address,
                chainId
            });

            if (response?.result?.data) {
                return response.result.data;
            } else {
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        data: {
                            blockchain: account.blockchain,
                            address: account.address,
                            chainId
                        },
                        response
                    })
                });

                SentryCaptureException(
                    new Error(`Cannot fetch delegated validators, no response data`)
                );
                return undefined;
            }
        } catch (error) {
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    data: {
                        blockchain: account.blockchain,
                        address: account.address,
                        chainId
                    },
                    error
                })
            });

            SentryCaptureException(
                new Error(`Cannot fetch delegated validators, ${error?.message}`)
            );
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
