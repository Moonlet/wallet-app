import { IAccountState } from '../state';
import { IFeeOptions, ITransactionExtraFields } from '../../../core/blockchain/types';
import { Dispatch } from 'react';
import { IAction } from '../../types';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { IValidator } from '../../../core/blockchain/types/stats';
import {
    openProcessTransactions,
    setProcessTransactions
} from '../../ui/process-transactions/actions';
import { TransactionStatus } from '../../../core/wallet/types';
import { cloneDeep } from 'lodash';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { PosBasicActionType } from '../../../core/blockchain/types/token';

export const swap = (
    account: IAccountState,
    validators: {
        validator: IValidator;
        amount: string;
    }[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    // TODO CHANGE PROPERLY to SWAP
    try {
        const extra: ITransactionExtraFields = {
            ...extraFields
        };
        const blockchainInstance = getBlockchain(account.blockchain);

        dispatch(openProcessTransactions());

        const txs = await blockchainInstance.transaction.buildPosTransaction(
            {
                chainId,
                account,
                validators: validators as any,
                amount: '0',
                token,
                feeOptions:
                    feeOptions?.gasPrice && feeOptions?.gasLimit
                        ? {
                              gasPrice: feeOptions.gasPrice.toString(),
                              gasLimit: feeOptions.gasLimit.toString()
                          }
                        : undefined,
                extraFields: extra
            },
            PosBasicActionType.UNSTAKE
        );
        dispatch(
            setProcessTransactions(
                cloneDeep(txs).map(tx => {
                    tx.status = TransactionStatus.CREATED;
                    return tx;
                })
            )
        );
    } catch (errorMessage) {
        SentryCaptureException(new Error(JSON.stringify(errorMessage)));
    }
};
