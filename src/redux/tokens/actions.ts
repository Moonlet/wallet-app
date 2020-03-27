import { IAccountState } from '../wallets/state';
import { ITokenConfigState, ITokenState } from './state';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { addTokenToAccount, removeTokenFromAccount } from '../wallets/actions';
import { convertTokenConfig } from './static-selectors';

export const ADD_TOKEN = 'ADD_TOKEN';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';

export const addToken = (account: IAccountState, token: ITokenConfigState) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    addTokenToAccount(account, convertTokenConfig(token, account))(dispatch, getState);

    dispatch({
        type: ADD_TOKEN,
        data: { token, blockchain: account.blockchain }
    });
};

export const removeToken = (account: IAccountState, token: ITokenState) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    removeTokenFromAccount(account, token)(dispatch, getState);

    // dispatch({
    //     type: ADD_TOKEN,
    //     data: { token }
    // });
};
