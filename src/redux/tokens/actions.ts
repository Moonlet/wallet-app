import { IAccountState } from '../wallets/state';
import { ITokenConfigState } from './state';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { addTokenToAccount } from '../wallets/actions';
import { generateAccountTokenState } from './static-selectors';
import { getChainId } from '../preferences/selectors';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';

export const ADD_TOKEN = 'ADD_TOKEN';
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
