import { Dispatch } from 'react';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IAccountState } from '../../wallets/state';
import { ApiClient } from '../../../core/utils/api-client/api-client';

export const ADD_VALIDATORS = 'ADD_VALIDATORS';

export const fetchValidators = (account: IAccountState, posAction: PosBasicActionType) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const blockchain = account.blockchain;
    const chainId = getChainId(state, blockchain).toString();
    const address = account.address.toLowerCase();

    const data = await new ApiClient().validators.fetchValidators(
        blockchain,
        chainId,
        address,
        posAction
    );

    if (data) {
        dispatch({
            type: ADD_VALIDATORS,
            data: { validators: data, chainId, blockchain }
        });
    }
};
