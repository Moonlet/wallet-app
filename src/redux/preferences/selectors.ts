import { IReduxState } from '../state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { createSelector } from 'reselect';
import { IPrefState } from './state';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';

export const getChainId = (state: IReduxState, blockchain: Blockchain): ChainIdType => {
    if (state.preferences.networks[blockchain]) {
        if (state.preferences.testNet === true) {
            return state.preferences.networks[blockchain].testNet;
        }
        return state.preferences.networks[blockchain].mainNet;
    } else {
        if (blockchain) {
            getBlockchain(blockchain).networks.filter(
                n => n.mainNet === !!state.preferences.testNet
            )[0].chainId;
        } else {
            return '';
        }
    }
};

export const getNetworkName = (state: IReduxState, blockchain: Blockchain): string => {
    return getBlockchain(blockchain).networks.find(
        network => network.chainId === getChainId(state, blockchain)
    ).name;
};

export const getBlockchains = createSelector(
    (state: IReduxState) => state.preferences,
    (preferences: IPrefState) => {
        const blockchains: Blockchain[] = [];
        Object.keys(preferences.blockchains).map(key => {
            const active = preferences.blockchains[key].active;

            if (active) {
                if (key === Blockchain.NEAR) {
                    if (isFeatureActive(RemoteFeature.NEAR) === true) {
                        blockchains.push(Blockchain[key]);
                    }
                } else {
                    blockchains.push(Blockchain[key]);
                }
            }
        });
        return blockchains;
    }
);
