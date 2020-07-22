import { Dispatch } from 'react';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IAccountState } from '../../wallets/state';

// actions consts
export const GET_VALIDATORS = 'GET_VALIDATORS';
export const ADD_VALIDATORS = 'ADD_VALIDATORS';

export const fetchValidators = (account: IAccountState, posAction: PosBasicActionType) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const blockchain = account.blockchain;
    const chainId = getChainId(state, blockchain).toString();

    const result = await fetch('http://127.0.0.1:8080/wallet-ui/validators/list', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            blockchain,
            address: account.address.toLowerCase(),
            chainId,
            posAction
        })
    });

    const response = await result.json();
    dispatch({
        type: ADD_VALIDATORS,
        data: { validators: response.result.data, chainId, blockchain }
    });

    return response.result.data;
};
