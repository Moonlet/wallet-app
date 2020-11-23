import { Dispatch } from 'react';
import DeviceInfo from 'react-native-device-info';
import { IReduxState } from '../../../state';
import {
    ICta,
    ICtaAction,
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
import {
    buildDummyValidator,
    claimRewardNoInput,
    delegate,
    withdraw
} from '../../../wallets/actions';
import { setScreenInputData, toggleValidatorMultiple } from '../input-data/actions';
import { NavigationService } from '../../../../navigation/navigation-service';
import { openURL } from '../../../../core/utils/linking-handler';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';

export const FETCH_SCREEN_DATA = 'FETCH_SCREEN_DATA';
export const SCREEN_DATA_START_LOADING = 'SCREEN_DATA_START_LOADING';
export const LOAD_MORE_VALIDATORS = 'LOAD_MORE_VALIDATORS';

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
            step: context?.step,
            tab: context?.tab,
            flowId: context?.flowId
        },
        user: {
            os: Platform.OS as 'ios' | 'android' | 'web',
            deviceId: state.preferences.deviceId,
            appVersion: DeviceInfo.getVersion(),
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

const handleCtaAction = async (
    action: ICtaAction,
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState,
    options?: {
        screenKey?: string;
        validator?: {
            id: string;
            name: string;
            icon?: string;
            website?: string;
        };
    }
) => {
    const state = getState();

    switch (action.type) {
        case 'callAction':
            switch (action.params.action) {
                case PosBasicActionType.CLAIM_REWARD_NO_INPUT: {
                    let validators = [];

                    if (action.params?.params?.validators) {
                        for (const v of action.params.params.validators) {
                            const validator = buildDummyValidator(v.validatorId, v.validatorName);
                            validators.push(validator);
                        }
                    } else {
                        validators = [
                            buildDummyValidator(
                                action.params.params.validatorId,
                                action.params.params.validatorName
                            )
                        ];
                    }

                    claimRewardNoInput(
                        getSelectedAccount(state),
                        validators,
                        action.params?.params?.tokenSymbol,
                        undefined
                    )(dispatch, getState);
                    break;
                }

                case PosBasicActionType.WITHDRAW: {
                    const withdrawValidator =
                        action?.params?.params?.validatorId &&
                        action?.params?.params?.validatorName &&
                        buildDummyValidator(
                            action.params.params.validatorId,
                            action.params.params.validatorName
                        );

                    withdraw(
                        getSelectedAccount(state),
                        withdrawValidator && [withdrawValidator],
                        action.params?.params?.tokenSymbol,
                        { amount: action.params?.params?.amount },
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
                    setScreenInputData(
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

                case 'LOAD_MORE_VALIDATORS':
                    dispatch({
                        type: LOAD_MORE_VALIDATORS,
                        data: { screenKey: options.screenKey }
                    });
                    break;

                case 'delegateToValidator': {
                    if (
                        action.params?.params?.validatorId &&
                        action.params?.params?.validatorName &&
                        action.params?.params?.token &&
                        action.params?.params?.flowId
                    ) {
                        const { flowId, token, validatorId, validatorName } = action.params.params;

                        if (
                            state.ui.screens.inputData &&
                            state.ui.screens.inputData[flowId]?.inputAmount
                        ) {
                            const amount = state.ui.screens.inputData[flowId].inputAmount;

                            const validators = [buildDummyValidator(validatorId, validatorName)];

                            delegate(
                                getSelectedAccount(state),
                                amount,
                                validators,
                                token,
                                undefined, // feeOptions
                                undefined
                            )(dispatch, getState);
                        }
                    }
                    break;
                }

                default:
                    break;
            }
            break;

        case 'navigateTo': {
            const screen = action.params?.params?.screen || action.params?.screen;
            const screenKey = action.params?.params?.context?.key;

            const account = getSelectedAccount(state);
            const chainId = getChainId(state, account.blockchain);

            let token: ITokenState;
            if (action?.params?.params?.token === true) {
                const blockchainConfig = getBlockchain(account.blockchain);
                token = account.tokens[chainId][blockchainConfig.config.coin];
            }

            NavigationService.navigate(
                screen,
                {
                    ...action.params?.params,
                    blockchain: account?.blockchain,
                    accountIndex: account?.index,
                    token
                },
                screenKey
            );
            break;
        }

        case 'openUrl':
            action?.params?.url && openURL(action.params.url);
            break;

        case 'onBack':
            NavigationService.goBack();
            break;

        default:
            break;
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

    if (cta?.actions && Array.isArray(cta?.actions)) {
        for (const action of cta.actions) {
            await handleCtaAction(action, dispatch, getState, options);
        }
    } else {
        // used this to handle deprecated versions
        await handleCtaAction(
            {
                type: cta.type,
                params: cta?.params
            },
            dispatch,
            getState,
            options
        );
    }
};
