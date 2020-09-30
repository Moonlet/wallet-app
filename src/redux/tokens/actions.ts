import { IAccountState } from '../wallets/state';
import { ITokenConfigState } from './state';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { addTokenToAccount } from '../wallets/actions';
import { generateAccountTokenState } from './static-selectors';
import { getChainId } from '../preferences/selectors';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { ApiClient } from '../../core/utils/api-client/api-client';
import { flattenObject } from '../utils/helpers';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export const ADD_TOKEN = 'ADD_TOKEN';
export const UPDATE_TOKEN_CONTRACT_ADDRESS = 'UPDATE_TOKEN_CONTRACT_ADDRESS';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';

export const addToken = (account: IAccountState, token: ITokenConfigState) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const blockchain = account.blockchain;
    const chainId = getChainId(getState(), blockchain).toString();
    addTokenForBlockchain(blockchain, token, chainId)(dispatch, getState);
    addTokenToAccount(account, generateAccountTokenState(token, account))(dispatch, getState);
};

export const addTokenForBlockchain = (
    blockchain: Blockchain,
    token: ITokenConfigState,
    chainId: ChainIdType
) => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    dispatch({
        type: ADD_TOKEN,
        data: { token, chainId, blockchain }
    });
};

export const updateTokenContracts = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    if (state.tokens) {
        const flatObject = flattenObject(state.tokens, 2);
        const keys = [];
        Object.keys(flatObject).map(key => {
            const strings = key.split('.');
            strings.splice(strings.length - 1, 0, 'tokens');
            strings.splice(0, 1, strings[0].toLowerCase());
            keys.push(strings.join('.'));
        });

        try {
            const configs = await new ApiClient().configs.getConfigs(keys);

            if (configs.result) {
                Object.keys(configs.result).map(key => {
                    const values = key.split('.');
                    const chainId = values[1];
                    const blockchain = values[0].toUpperCase();
                    const tokenSymbol = values[3];
                    const contractAddress = configs.result[key];
                    dispatch({
                        type: UPDATE_TOKEN_CONTRACT_ADDRESS,
                        data: { chainId, blockchain, tokenSymbol, contractAddress }
                    });
                });
            }
        } catch (error) {
            SentryCaptureException(new Error(JSON.stringify(error)));
        }
    }
};
