import { Dispatch } from 'react';
import { IReduxState } from '../../../state';
import { ICta, ICtaAction } from '../../../../components/widgets/types';
import { IAction } from '../../../types';
import {
    getNrPendingTransactions,
    getSelectedAccount,
    getSelectedWallet
} from '../../../wallets/selectors';
import { getChainId } from '../../../preferences/selectors';
import { PosBasicActionType } from '../../../../core/blockchain/types/token';
import {
    buildDummyValidator,
    claimRewardNoInput,
    delegate,
    redelegate,
    setSelectedBlockchain,
    withdraw
} from '../../../wallets/actions';
import { setScreenInputData, toggleValidatorMultiple } from '../input-data/actions';
import { NavigationService } from '../../../../navigation/navigation-service';
import { openURL } from '../../../../core/utils/linking-handler';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { getScreenDataKey } from './reducer';
import { Dialog } from '../../../../components/dialog/dialog';
import { translate } from '../../../../core/i18n';
import { LOAD_MORE_VALIDATORS } from './actions';
import { ITokenState } from '../../../wallets/state';

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
                case 'multipleSelection':
                    toggleValidatorMultiple(options.screenKey, {
                        id: options.validator.id,
                        name: options.validator.name,
                        icon: options?.validator?.icon,
                        website: options.validator?.website
                    })(dispatch, getState);
                    break;

                case 'SINGLE_SELECTION':
                case 'singleSelection':
                    setScreenInputData(options.screenKey, {
                        validators: [
                            {
                                id: options.validator.id,
                                name: options.validator.name,
                                icon: options.validator?.icon,
                                website: options.validator?.website
                            }
                        ]
                    })(dispatch, getState);
                    break;

                case 'LOAD_MORE_VALIDATORS':
                case 'loadMoreValidators':
                    dispatch({
                        type: LOAD_MORE_VALIDATORS,
                        data: { screenKey: options.screenKey }
                    });
                    break;

                case 'delegateToValidator': {
                    // Run Screen Validations

                    // Take amount from screen
                    const account = getSelectedAccount(state);
                    const chainId = getChainId(state, account.blockchain);

                    const screenKey = getScreenDataKey({
                        pubKey: getSelectedWallet(state)?.walletPublicKey,
                        blockchain: account?.blockchain,
                        chainId: String(chainId),
                        address: account?.address,
                        step: action.params?.params?.step,
                        tab: undefined
                    });

                    // Open Process Tx
                    if (
                        action.params?.params?.validatorId &&
                        action.params?.params?.validatorName &&
                        action.params?.params?.token
                    ) {
                        const { token, validatorId, validatorName } = action.params.params;

                        if (
                            state.ui.screens.inputData &&
                            state.ui.screens.inputData[screenKey]?.data?.amount
                        ) {
                            const amount = state.ui.screens.inputData[screenKey].data.amount;

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

                case 'switchNodeDelegateToValidator': {
                    // Run Screen Validations

                    // Take amount from screen
                    const account = getSelectedAccount(state);
                    const chainId = getChainId(state, account.blockchain);

                    const context = action.params?.params?.context;

                    const screenKey = getScreenDataKey({
                        pubKey: getSelectedWallet(state)?.walletPublicKey,
                        blockchain: account?.blockchain,
                        chainId: String(chainId),
                        address: account?.address,
                        step: context?.step,
                        tab: undefined
                    });

                    // Node details are stored on flow
                    const switchNodeValidator =
                        state.ui.screens.inputData[context?.flowId]?.data?.switchNodeValidator;

                    // Open Process Tx
                    if (
                        switchNodeValidator &&
                        action.params?.params?.token &&
                        state.ui.screens.inputData &&
                        state.ui.screens.inputData[screenKey] &&
                        state.ui.screens.inputData[screenKey]?.data?.amount &&
                        action.params?.params?.toValidator
                    ) {
                        const fromValidator = buildDummyValidator(
                            switchNodeValidator.id,
                            switchNodeValidator.name
                        );

                        const validators = [
                            buildDummyValidator(
                                action.params.params.toValidator.id,
                                action.params.params.toValidator.name
                            )
                        ];

                        const amount = state.ui.screens.inputData[screenKey]?.data?.amount;

                        redelegate(
                            getSelectedAccount(state),
                            amount,
                            validators,
                            action.params.params.token,
                            undefined, // feeOptions
                            { fromValidator }
                        )(dispatch, getState);
                    }
                    break;
                }

                case 'setSwitchNodeValidator':
                    setScreenInputData(action.params?.params?.flowId, {
                        switchNodeValidator: {
                            id: action.params?.params?.validatorId,
                            name: action.params?.params?.validatorName,
                            availableBalance: action.params?.params?.availableBalance
                        }
                    })(dispatch, getState);
                    break;

                case 'hasPendingTransactions':
                    if (getNrPendingTransactions(state)) {
                        const nvServiceFn =
                            NavigationService.getCurrentRoute() === 'Dashboard'
                                ? 'navigate'
                                : 'replace';
                        Dialog.alert(
                            translate('Validator.cannotInitiateTxTitle'),
                            translate('Validator.cannotInitiateTxMessage'),
                            undefined,
                            {
                                text: translate('App.labels.ok'),
                                onPress: () =>
                                    NavigationService[nvServiceFn]('TransactonsHistory', {})
                            }
                        );
                    }
                    break;

                case 'selectBlockchain':
                    setSelectedBlockchain(action.params?.params?.blockchain)(dispatch, getState);
                    break;

                case 'switchNodeSelectReasons':
                    const infoText = action.params?.params?.infoText;
                    const flowId = action.params?.params?.flowId;

                    const selectReasons = [];
                    Object.assign(
                        selectReasons,
                        state.ui.screens.inputData[flowId]?.data?.selectReasons
                    );
                    const reasonIndex = selectReasons.findIndex(r => r === infoText);

                    if (reasonIndex === -1) {
                        // select reason
                        selectReasons.push(infoText);
                    } else {
                        // unselect reason
                        selectReasons.splice(reasonIndex, 1);
                    }

                    setScreenInputData(flowId, {
                        selectReasons
                    })(dispatch, getState);
                    break;

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
