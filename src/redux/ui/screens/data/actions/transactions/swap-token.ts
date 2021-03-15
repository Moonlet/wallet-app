import { IAction } from '../../../../../types';
import { Dispatch } from 'react';
import { IHandleCtaActionContext } from '../';
import { IReduxState } from '../../../../../state';

interface ISwapTokenParams {
    fromToken: string;
    fromAmount: string;
    toToken: string;
    toAmount: string;
}

export const swapToken = (context: IHandleCtaActionContext<ISwapTokenParams>) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    // const state = getState();
    // const chainId = getChainId(state, account.blockchain);
    // // TODO CHANGE PROPERLY to SWAP
    // try {
    //     const extra: ITransactionExtraFields = {
    //         ...extraFields
    //     };
    //     const blockchainInstance = getBlockchain(account.blockchain);
    //     dispatch(openProcessTransactions());
    //     const txs = await blockchainInstance.transaction.buildPosTransaction(
    //         {
    //             chainId,
    //             account,
    //             validators: validators as any,
    //             amount: '0',
    //             token,
    //             feeOptions:
    //                 feeOptions?.gasPrice && feeOptions?.gasLimit
    //                     ? {
    //                           gasPrice: feeOptions.gasPrice.toString(),
    //                           gasLimit: feeOptions.gasLimit.toString()
    //                       }
    //                     : undefined,
    //             extraFields: extra
    //         },
    //         PosBasicActionType.UNSTAKE
    //     );
    //     dispatch(
    //         setProcessTransactions(
    //             cloneDeep(txs).map(tx => {
    //                 tx.status = TransactionStatus.CREATED;
    //                 return tx;
    //             })
    //         )
    //     );
    // } catch (errorMessage) {
    //     SentryCaptureException(new Error(JSON.stringify(errorMessage)));
    // }
};
