import { IAccountState } from '../state';
import {
    IFeeOptions,
    ITransactionExtraFields
    // TransactionMessageType,
    // TransactionMessageText,
    // IBlockchainTransaction
} from '../../../core/blockchain/types';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Dispatch } from 'react';
import { IAction } from '../../types';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { getSelectedWallet } from '../selectors';
import { LoadingModal } from '../../../components/loading-modal/loading-modal';
// import { WalletType } from '../../../core/wallet/types';
import { WalletFactory } from '../../../core/wallet/wallet-factory';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../tokens/static-selectors';
// import { LedgerWallet } from '../../../core/wallet/hw-wallet/ledger/ledger-wallet';
// import { TRANSACTION_PUBLISHED } from '../actions';
import { translate } from '../../../core/i18n';
import { Dialog } from '../../../components/dialog/dialog';
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IValidator } from '../../../core/blockchain/types/stats';
import {
    openProcessTransactions,
    setProcessTransactions,
    updateProcessTransactionIdForIndex,
    updateProcessTransactionStatusForIndex
} from '../../ui/process-transactions/actions';
import { TRANSACTION_PUBLISHED } from './wallet-actions';
import { TransactionStatus } from '../../../core/wallet/types';

export const delegate = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransactionExtraFields,
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
    extraFields: ITransactionExtraFields,
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

export const activate = (
    account: IAccountState,
    token: string,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        undefined,
        undefined,
        token,
        undefined,
        password,
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.ACTIVATE,
        sendResponse
    )(dispatch, getState);
};

export const withdraw = (
    account: IAccountState,
    index: number,
    token: string,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        undefined,
        undefined,
        token,
        undefined,
        password,
        navigation,
        { witdrawIndex: index },
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
    extraFields: ITransactionExtraFields,
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
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    type: PosBasicActionType,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    const appWallet = getSelectedWallet(state);

    try {
        // await LoadingModal.open({
        //     type: TransactionMessageType.INFO,
        //     text:
        //         appWallet.type === WalletType.HW
        //             ? TransactionMessageText.CONNECTING_LEDGER
        //             : TransactionMessageText.SIGNING
        // });

        const extra: ITransactionExtraFields = {
            ...extraFields,
            posAction: type
        };

        const wallet = await WalletFactory.get(appWallet.id, appWallet.type, {
            pass: password,
            deviceVendor: appWallet.hwOptions?.deviceVendor,
            deviceModel: appWallet.hwOptions?.deviceModel,
            deviceId: appWallet.hwOptions?.deviceId,
            connectionType: appWallet.hwOptions?.connectionType
        }); // encrypted string: pass)
        const blockchainInstance = getBlockchain(account.blockchain);
        const tokenConfig = getTokenConfig(account.blockchain, token);

        dispatch(openProcessTransactions());

        const txs = await blockchainInstance.transaction.buildPosTransaction(
            {
                chainId,
                account,
                validators,
                amount:
                    blockchainInstance.account
                        .amountToStd(amount, tokenConfig.decimals)
                        .toFixed() || '0',
                token,
                feeOptions: {
                    gasPrice: feeOptions.gasPrice.toString(),
                    gasLimit: feeOptions.gasLimit.toString()
                },
                extraFields: extra
            },
            type
        );

        dispatch(setProcessTransactions(txs));

        let index = 0;
        let transactionPublished = false;
        let txHash = '';

        const interval = setInterval(async () => {
            if (txs.length > index) {
                const client = getBlockchain(account.blockchain).getClient(chainId);

                if (transactionPublished === false) {
                    const transaction = await wallet.sign(
                        account.blockchain,
                        account.index,
                        txs[index]
                    );
                    txHash = await client.sendTransaction(transaction);
                    if (txHash) {
                        dispatch(updateProcessTransactionIdForIndex(index, txHash));
                        dispatch({
                            type: TRANSACTION_PUBLISHED,
                            data: {
                                hash: txHash,
                                tx: txs[index],
                                walletId: appWallet.id
                            }
                        });
                        transactionPublished = true;
                    } else {
                        dispatch(
                            updateProcessTransactionStatusForIndex(index, TransactionStatus.FAILED)
                        );
                        clearInterval(interval);
                    }
                } else {
                    try {
                        const transaction = await client.utils.getTransaction(txHash);
                        dispatch(updateProcessTransactionStatusForIndex(index, transaction.status));
                        index++;
                        transactionPublished = false;
                        if (index === txs.length) clearInterval(interval);
                    } catch (e) {
                        // transaction not yet published - do nothing
                    }
                }
            } else clearInterval(interval);
        }, 2000);
    } catch (errorMessage) {
        await LoadingModal.close();
        Dialog.info(translate('LoadingModal.txFailed'), translate('LoadingModal.GENERIC_ERROR'));
    }
};
