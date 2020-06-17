import { IAccountState } from '../state';
import {
    IFeeOptions,
    ITransferTransactionExtraFields,
    TransactionMessageType,
    TransactionMessageText
} from '../../../core/blockchain/types';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Dispatch } from 'react';
import { IAction } from '../../types';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { getSelectedWallet } from '../selectors';
import { LoadingModal } from '../../../components/loading-modal/loading-modal';
import { WalletType } from '../../../core/wallet/types';
import { WalletFactory } from '../../../core/wallet/wallet-factory';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../tokens/static-selectors';
import { LedgerWallet } from '../../../core/wallet/hw-wallet/ledger/ledger-wallet';
import { TRANSACTION_PUBLISHED } from '../actions';
import { ConnectExtension } from '../../../core/connect-extension/connect-extension';
import { CLOSE_TX_REQUEST, closeTransactionRequest } from '../../ui/transaction-request/actions';
import { translate } from '../../../core/i18n';
import { Dialog } from '../../../components/dialog/dialog';
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IValidator } from '../../../core/blockchain/types/stats';

export const delegate = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransferTransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        validators,
        token,
        feeOptions,
        password,
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.DELEGATE,
        sendResponse
    )(dispatch, getState);
};

export const unlock = (
    account: IAccountState,
    amount: string,
    token: string,
    feeOptions: IFeeOptions,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransferTransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        [],
        token,
        feeOptions,
        password,
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.UNLOCK,
        sendResponse
    )(dispatch, getState);
};

export const withdraw = (
    account: IAccountState,
    amount: string,
    token: string,
    feeOptions: IFeeOptions,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransferTransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        undefined,
        token,
        feeOptions,
        password,
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.WITHDRAW,
        sendResponse
    )(dispatch, getState);
};

export const unvote = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransferTransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        validators,
        token,
        feeOptions,
        password,
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.UNVOTE,
        sendResponse
    )(dispatch, getState);
};

export const posAction = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransferTransactionExtraFields,
    goBack: boolean = true,
    type: PosBasicActionType,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    const appWallet = getSelectedWallet(state);

    try {
        await LoadingModal.open({
            type: TransactionMessageType.INFO,
            text:
                appWallet.type === WalletType.HW
                    ? TransactionMessageText.CONNECTING_LEDGER
                    : TransactionMessageText.SIGNING
        });

        const wallet = await WalletFactory.get(appWallet.id, appWallet.type, {
            pass: password,
            deviceVendor: appWallet.hwOptions?.deviceVendor,
            deviceModel: appWallet.hwOptions?.deviceModel,
            deviceId: appWallet.hwOptions?.deviceId,
            connectionType: appWallet.hwOptions?.connectionType
        }); // encrypted string: pass)
        const blockchainInstance = getBlockchain(account.blockchain);
        const tokenConfig = getTokenConfig(account.blockchain, token);

        const txs = await blockchainInstance.transaction.buildPosTransaction(
            {
                chainId,
                account,
                validators,
                amount: blockchainInstance.account
                    .amountToStd(amount, tokenConfig.decimals)
                    .toFixed(),
                token,
                feeOptions: {
                    gasPrice: feeOptions.gasPrice.toString(),
                    gasLimit: feeOptions.gasLimit.toString()
                },
                extraFields
            },
            type
        );

        txs.forEach(async tx => {
            if (appWallet.type === WalletType.HW) {
                await LoadingModal.showMessage({
                    text: TransactionMessageText.OPEN_APP,
                    type: TransactionMessageType.INFO
                });

                await (wallet as LedgerWallet).onAppOpened(account.blockchain);

                await LoadingModal.showMessage({
                    text: TransactionMessageText.REVIEW_TRANSACTION,
                    type: TransactionMessageType.INFO
                });
            }

            const transaction = await wallet.sign(account.blockchain, account.index, tx);

            await LoadingModal.showMessage({
                text: TransactionMessageText.BROADCASTING,
                type: TransactionMessageType.INFO
            });

            const txHash = await getBlockchain(account.blockchain)
                .getClient(chainId)
                .sendTransaction(transaction);

            // TODO - implement wait for transaction to be posted on blockchain

            if (txHash) {
                dispatch({
                    type: TRANSACTION_PUBLISHED,
                    data: {
                        hash: txHash,
                        tx: txs[0],
                        walletId: appWallet.id
                    }
                });

                if (sendResponse) {
                    await ConnectExtension.sendResponse(sendResponse.requestId, {
                        result: {
                            txHash,
                            tx: txs[0]
                        }
                    });

                    dispatch({ type: CLOSE_TX_REQUEST });
                }

                await LoadingModal.close();
                dispatch(closeTransactionRequest());
                goBack && navigation.goBack();
                return;
            } else {
                throw new Error('GENERIC_ERROR');
            }
        });
    } catch (errorMessage) {
        await LoadingModal.close();
        Dialog.info(translate('LoadingModal.txFailed'), translate('LoadingModal.GENERIC_ERROR'));
    }
};
