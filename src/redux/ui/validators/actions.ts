import { Dispatch } from 'react';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IAccountState } from '../../wallets/state';
import { ApiClient } from '../../../core/utils/api-client/api-client';
import { Blockchain } from '../../../core/blockchain/types';

export const ADD_VALIDATORS = 'ADD_VALIDATORS';
export const SET_IS_LOADING = 'SET_IS_LOADING';

export const fetchValidators = (
    account: IAccountState,
    posAction: PosBasicActionType,
    validatorAddress?: string
) => async (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const state = getState();
    const blockchain = account.blockchain;
    const chainId = getChainId(state, blockchain).toString();

    dispatch({
        type: SET_IS_LOADING,
        data: { chainId, blockchain }
    });

    // TODO fix the non base 58 problem on solana
    const address =
        account.blockchain === Blockchain.SOLANA ? account.address : account.address.toLowerCase();

    dispatch({
        type: ADD_VALIDATORS,
        data: { validators: undefined, chainId, blockchain }
    });

    const data = await new ApiClient().validators.fetchValidators(
        blockchain,
        chainId,
        address,
        posAction,
        validatorAddress
    );

    if (data) {
        dispatch({
            type: ADD_VALIDATORS,
            data: { validators: data, chainId, blockchain }
        });
    }
};
