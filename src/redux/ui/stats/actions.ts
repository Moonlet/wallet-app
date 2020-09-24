import { Dispatch } from 'react';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../preferences/selectors';
import { IReduxState } from '../../state';
import { IAccountState, ITokenState } from '../../wallets/state';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getAccountStatsTimestamp } from './selectors';
import { FETCH_ACCOUNT_STATS_SECONDS } from '../../../core/constants/app';
import moment from 'moment';

export const ADD_ACCOUNT_STATS = 'ADD_ACCOUNT_STATS';

export const fetchAccountDelegateStats = (account: IAccountState, token: ITokenState) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const blockchain = account.blockchain;
    const chainId = getChainId(state, blockchain).toString();

    try {
        const timestamp = getAccountStatsTimestamp(state, blockchain, chainId, account.address);

        if (
            !timestamp ||
            moment().isAfter(moment(timestamp).add(FETCH_ACCOUNT_STATS_SECONDS, 'seconds'))
        ) {
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
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};
