import { Dispatch } from 'react';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../preferences/selectors';
import { IReduxState } from '../../state';
import { IAccountState, ITokenState } from '../../wallets/state';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export const ADD_ACCOUNT_STATS = 'ADD_ACCOUNT_STATS';

export const fetchAccountDelegateStats = (account: IAccountState, token: ITokenState) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const blockchain = account.blockchain;
    const chainId = getChainId(state, blockchain).toString();

    try {
        const accountStats = await getBlockchain(blockchain)
            .getStats(chainId)
            .getAccountDelegateStats(account, token);

        if (accountStats) {
            dispatch({
                type: ADD_ACCOUNT_STATS,
                data: {
                    blockchain,
                    chainId,
                    address: account.address,
                    accountStats
                }
            });
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};
