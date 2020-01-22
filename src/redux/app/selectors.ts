import { IReduxState } from '../state';
import { Blockchain } from '../../core/blockchain/types';

export const getChainId = (state: IReduxState, blockchain: Blockchain): number => {
    if (state.preferences.testNet === true) {
        return state.app.networks[blockchain].testNet;
    }
    return state.app.networks[blockchain].mainNet;
};
