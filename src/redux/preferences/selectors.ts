import { IReduxState } from '../state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { createSelector } from 'reselect';
import { IPrefState, INetworksOptions } from './state';
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
    const network = getBlockchain(blockchain).networks.find(
        value => value.chainId === getChainId(state, blockchain)
    );

    return network ? network.name : '';
};

export const getNetworks = createSelector(
    (state: IReduxState) => state.preferences,
    (preferences: IPrefState) => {
        const networks: INetworksOptions[] = [];
        Object.keys(preferences.networks).map(blockchain => {
            let hasNetwork = false;
            if (preferences.testNet) {
                if (preferences.networks[blockchain].testNet !== undefined) {
                    hasNetwork = true;
                }
            } else {
                if (preferences.networks[blockchain].mainNet !== undefined) {
                    hasNetwork = true;
                }
            }

            if (hasNetwork) {
                if (blockchain === Blockchain.NEAR) {
                    if (isFeatureActive(RemoteFeature.NEAR) === true) {
                        networks[blockchain] = preferences.networks[blockchain];
                    }
                } else {
                    networks[blockchain] = preferences.networks[blockchain];
                }
            }
        });
        return networks;
    }
);

export const getBlockchains = createSelector(
    (state: IReduxState) => state.preferences,
    (preferences: IPrefState) => {
        const blockchains: Blockchain[] = [];
        Object.keys(preferences.blockchains).map(blockchain => {
            const active = preferences.blockchains[blockchain].active;

            let hasNetwork = false;
            if (preferences.testNet) {
                if (preferences.networks[blockchain].testNet !== undefined) {
                    hasNetwork = true;
                }
            } else {
                if (preferences.networks[blockchain].mainNet !== undefined) {
                    hasNetwork = true;
                }
            }

            if (active && hasNetwork) {
                if (blockchain === Blockchain.NEAR) {
                    if (isFeatureActive(RemoteFeature.NEAR) === true) {
                        blockchains.push(Blockchain[blockchain]);
                    }
                } else {
                    blockchains.push(Blockchain[blockchain]);
                }
            }
        });
        return blockchains;
    }
);
