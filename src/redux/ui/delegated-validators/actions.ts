import { Dispatch } from 'react';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { IAccountState } from '../../wallets/state';
import { ApiClient } from '../../../core/utils/api-client/api-client';

export const ADD_DELEGATED_VALIDATORS = 'ADD_DELEGATED_VALIDATORS';

export const fetchDelegatedValidators = (account: IAccountState) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const blockchain = account.blockchain;
    const chainId = getChainId(state, blockchain).toString();

    const data = await new ApiClient().validators.getValidatorsVotedForByAccount(account, chainId);

    if (data) {
        dispatch({
            type: ADD_DELEGATED_VALIDATORS,
            data: { validators: data, chainId, blockchain }
        });
    }
};
