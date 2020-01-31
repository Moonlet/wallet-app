import { IReduxState } from '../state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

export const getChainId = (state: IReduxState, blockchain: Blockchain): ChainIdType => {
    if (state.preferences.networks[blockchain]) {
        if (state.preferences.testNet === true) {
            return state.preferences.networks[blockchain].testNet;
        }
        return state.preferences.networks[blockchain].mainNet;
    } else {
        getBlockchain(blockchain).networks.filter(n => n.mainNet === !!state.preferences.testNet)[0]
            .chainId;
    }
};
