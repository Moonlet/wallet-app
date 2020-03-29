import { IAccountState } from '../wallets/state';
import { ITokenConfigState } from './state';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { addTokenToAccount } from '../wallets/actions';
import { convertTokenConfig } from './static-selectors';
import { getChainId } from '../preferences/selectors';

export const ADD_TOKEN = 'ADD_TOKEN';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';

export const addToken = (account: IAccountState, token: ITokenConfigState) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const blockchain = account.blockchain;
    const chainId = getChainId(getState(), blockchain).toString();
    dispatch({
        type: ADD_TOKEN,
        data: { token, chainId, blockchain }
    });
    addTokenToAccount(account, convertTokenConfig(token, account))(dispatch, getState);
};
