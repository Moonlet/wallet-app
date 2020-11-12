import { Dispatch } from 'react';
import DeviceInfo from 'react-native-device-info';
import { IReduxState } from '../../../state';
import {
    ICta,
    IScreenContext,
    IScreenRequest,
    IScreenResponse
} from '../../../../components/widgets/types';
import { ApiClient } from '../../../../core/utils/api-client/api-client';
import { AccountType, ITokenState } from '../../../wallets/state';
import { IAction } from '../../../types';
import { getSelectedAccount, getSelectedWallet } from '../../../wallets/selectors';
import { Platform } from 'react-native';
import { getChainId } from '../../../preferences/selectors';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';
import { PosBasicActionType } from '../../../../core/blockchain/types/token';
import { buildDummyValidator, claimRewardNoInput, withdraw } from '../../../wallets/actions';
import { selectInput, toggleValidatorMultiple } from '../input-data/actions';
import { NavigationService } from '../../../../navigation/navigation-service';
import { openURL } from '../../../../core/utils/linking-handler';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';

export const FETCH_SCREEN_DATA = 'FETCH_SCREEN_DATA';
export const SCREEN_DATA_START_LOADING = 'SCREEN_DATA_START_LOADING';

export const fetchScreenData = (context: IScreenContext) => async (
    dispatch: Dispatch<
        IAction<
            | { request: IScreenRequest }
            | {
                  request: IScreenRequest;
                  response: IScreenResponse;
                  isLoading: boolean;
                  error: any;
              }
        >
    >,
    getState: () => IReduxState
) => {
    const state = getState();
    const wallet = getSelectedWallet(state);
    if (!wallet) return;
    const account = getSelectedAccount(state);
    if (!account) return;
    const chainId = getChainId(state, account.blockchain);
    if (!chainId || chainId === '') return;

    const apiClient = new ApiClient();

    const body: IScreenRequest = {
        context: {
            screen: context.screen,
            tab: context?.tab
        },
        user: {
            os: Platform.OS as 'ios' | 'android' | 'web',
            deviceId: state.preferences.deviceId,
            appVersion: DeviceInfo.getReadableVersion(),
            theme: 'dark',
            lang: 'en',

            wallet: {
                pubKey: wallet.walletPublicKey,
                type: wallet.type
            },

            blockchain: account.blockchain,
            chainId: String(chainId),
            address: account.address,
            accountType: AccountType.DEFAULT
        }
    };

    // start loading
    dispatch({ type: SCREEN_DATA_START_LOADING, data: { request: body } });

    try {
        // fetch screen data
        const screenResponse = await apiClient.http.post('/walletUi/screen', body);
        const data: IScreenResponse = screenResponse?.result?.data;

        dispatch({
            type: FETCH_SCREEN_DATA,
            data: {
                request: body,
                response: data,
                isLoading: false,
                error: !data && screenResponse?.message
            }
        });

        if (!screenResponse?.result?.data) {
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    request: body,
                    screenResponse
                })
            });

            SentryCaptureException(new Error('Fetch /walletUi/screen'));
        }
    } catch (error) {
        // handle error
        dispatch({
            type: FETCH_SCREEN_DATA,
            data: {
                request: body,
                response: undefined,
                isLoading: false,
                error: error || 'ERROR FETCH_SCREEN_DATA'
            }
        });

        SentryAddBreadcrumb({
            message: JSON.stringify({
                request: body,
                error
            })
        });

        SentryCaptureException(new Error('Fetch /walletUi/screen'));
    }
};

export const handleCta = (
    cta: ICta,
    options?: {
        screenKey?: string;
        validator?: {
            id: string;
            name: string;
            icon?: string;
            website?: string;
        };
    }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    if (!cta) {
        return;
    }

    const state = getState();

    switch (cta.type) {
        case 'callAction':
            switch (cta.params.action) {
                case PosBasicActionType.CLAIM_REWARD_NO_INPUT:
                    const validator = buildDummyValidator(
                        cta.params.params.validatorId,
                        cta.params.params.validatorName
                    );

                    claimRewardNoInput(
                        getSelectedAccount(state),
                        [validator],
                        cta.params.params.tokenSymbol,
                        undefined
                    )(dispatch, getState);
                    break;

                case PosBasicActionType.WITHDRAW: {
                    const withdrawValidator =
                        cta?.params?.params?.validatorId &&
                        cta?.params?.params?.validatorName &&
                        buildDummyValidator(
                            cta.params.params.validatorId,
                            cta.params.params.validatorName
                        );

                    withdraw(
                        getSelectedAccount(state),
                        withdrawValidator && [withdrawValidator],
                        cta.params.params.tokenSymbol,
                        { amount: cta.params.params.amount },
                        undefined
                    )(dispatch, getState);
                    break;
                }

                case 'MULTIPLE_SELECTION':
                    toggleValidatorMultiple(options.screenKey, {
                        id: options.validator.id,
                        name: options.validator.name,
                        icon: options?.validator?.icon,
                        website: options.validator?.website
                    })(dispatch, getState);

                    break;
                case 'SINGLE_SELECTION':
                    selectInput(
                        options.screenKey,
                        [
                            {
                                id: options.validator.id,
                                name: options.validator.name,
                                icon: options.validator?.icon,
                                website: options.validator?.website
                            }
                        ],
                        'validators'
                    )(dispatch, getState);
                    break;

                case 'LOAD_MORE':
                    // TODO
                    break;

                default:
                    break;
            }
            break;

        case 'navigateTo':
            const screen = cta.params?.params?.screen || cta.params?.screen;

            const account = getSelectedAccount(state);
            const chainId = getChainId(state, account.blockchain);

            let token: ITokenState;
            if (cta?.params?.params?.token === true) {
                const blockchainConfig = getBlockchain(account.blockchain);
                token = account.tokens[chainId][blockchainConfig.config.coin];
            }

            NavigationService.navigate(screen, {
                ...cta.params.params,
                blockchain: account?.blockchain,
                accountIndex: account?.index,
                token
            });
            break;

        case 'openUrl':
            cta?.params?.url && openURL(cta.params.url);
            break;

        default:
            break;
    }
};
