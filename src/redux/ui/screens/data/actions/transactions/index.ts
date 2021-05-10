import { cloneDeep } from 'lodash';
import { Dispatch } from 'react';
import { IHandleCtaActionContext } from '../index';
import { Contracts } from '../../../../../../core/blockchain/zilliqa/config';
import { TransactionStatus } from '../../../../../../core/wallet/types';
import { IReduxState } from '../../../../../state';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { IAction } from '../../../../../types';
import {
    openProcessTransactions,
    setProcessTransactions
} from '../../../../process-transactions/actions';
import { buildContractCallTransaction } from './transaction-builder';

export * from './transaction-builder';

export interface IContractCallArg {
    type: string;
    data: {
        type: 'value' | 'selector';
        value: any;
    };
    name?: string;
}

export interface IContractCallParams {
    args: IContractCallArg[];
    amount: string;
    contractMethod: string;
    contractType: Contracts;
    tokenSymbol: string;
    additionalInfo: any;
    fees?: {
        gasLimit: string;
        gasPrice?: string;
        total?: string;
    };
}

export const sendTransactions = (context: IHandleCtaActionContext<IContractCallParams[]>) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    if (context.action.params.params) {
        const params = context.action.params.params;

        try {
            dispatch(openProcessTransactions());

            const txs = [];
            for (const param of params) {
                const tx = await buildContractCallTransaction(getState, param, txs);
                txs.push(tx);
            }

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
};
