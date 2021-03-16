import { IAction } from '../../../../../types';
import { Dispatch } from 'react';
import { IHandleCtaActionContext } from '../';
import { IReduxState } from '../../../../../state';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getSelectedAccount } from '../../../../../wallets/selectors';
import { getChainId } from '../../../../../preferences/selectors';
import cloneDeep from 'lodash/cloneDeep';
import { ITransactionExtraFields } from '../../../../../../core/blockchain/types';
import {
    openProcessTransactions,
    setProcessTransactions
} from '../../../../process-transactions/actions';
import { getBlockchain } from '../../../../../../core/blockchain/blockchain-factory';
import { TransactionStatus } from '../../../../../../core/wallet/types';

export interface ISwapTokenParams {
    fromToken: string;
    fromAmount: string;
    toToken: string;
    toAmount: string;
}

export const swapToken = (context: IHandleCtaActionContext<ISwapTokenParams>) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    if (context.action.params.params) {
        const params = context.action.params.params;
        const state = getState();
        const account = getSelectedAccount(state);
        const chainId = getChainId(state, account.blockchain);
        const blockchainInstance = getBlockchain(account.blockchain);

        try {
            const swapParams = {
                ...params,
                fromToken: 'ZIL',
                fromAmount: '1000000',
                toToken: 'gZIL',
                toAmount: ''
            };

            const extra: ITransactionExtraFields = {
                swapParams
            };

            dispatch(openProcessTransactions());
            const txs = await blockchainInstance.transaction.buildSwapTransaction({
                account,
                chainId,
                toAddress: '',
                amount: '0',
                token: blockchainInstance.config.coin,
                feeOptions: undefined,
                // feeOptions?.gasPrice && feeOptions?.gasLimit
                //     ? {
                //           gasPrice: feeOptions.gasPrice.toString(),
                //           gasLimit: feeOptions.gasLimit.toString()
                //       }
                //     : undefined,
                extraFields: extra
            });

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
    } else {
        SentryCaptureException(
            new Error(
                JSON.stringify({
                    message: 'Smart screen action params not available',
                    action: context
                })
            )
        );
    }

    // // TODO CHANGE PROPERLY to SWAP
};
