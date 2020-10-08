import { Dispatch } from 'react';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../preferences/selectors';
import { IReduxState } from '../../state';
import { IAccountState, ITokenState } from '../../wallets/state';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getAccountStatsTimestamp } from './selectors';

export const ADD_ACCOUNT_STATS = 'ADD_ACCOUNT_STATS';

export const fetchAccountDelegateStats = (account: IAccountState, token: ITokenState) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const blockchain = account.blockchain;
    const chainId = getChainId(state, blockchain).toString();
    const blockchainInstante = getBlockchain(blockchain);

    try {
        const timestamp = getAccountStatsTimestamp(state, blockchain, chainId, account.address);

        if (
            !timestamp ||
            timestamp < Date.now() - blockchainInstante.config.ui.fetchAccountStatsSec * 1000
        ) {
            const accountStats = await blockchainInstante
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
