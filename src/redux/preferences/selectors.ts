import { IReduxState } from '../state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { getBlockchain, BLOCKCHAIN_LIST } from '../../core/blockchain/blockchain-factory';
import { createSelector } from 'reselect';
import { IPrefState, INetworksOptions, IBlockchainsOptions, IBlockchainOptions } from './state';
import { isFeatureActive, RemoteFeature } from '../../core/utils/remote-feature-config';

export const getChainId = (state: IReduxState, blockchain: Blockchain): ChainIdType => {
    if (!BLOCKCHAIN_LIST.includes(blockchain)) {
        return '';
    }

    const reduxObject = state.preferences?.networks && state.preferences?.networks[blockchain];
    const network =
        reduxObject === undefined
            ? getBlockchain(blockchain).config.networks
            : state.preferences.networks[blockchain];

    if (state.preferences.testNet === true) {
        return network.testNet;
    }
    return network.mainNet ? network.mainNet : '';
};

export const getNetworkName = (state: IReduxState, blockchain: Blockchain): string => {
    if (!blockchain || !state.preferences) {
        return '';
    }

    const network = getBlockchain(blockchain).networks.find(
        value => value.chainId === getChainId(state, blockchain)
    );

    return network ? network.name : '';
};

export const getNetworks = createSelector(
    (state: IReduxState) => state.preferences,
    (preferences: IPrefState) => {
        const networks: INetworksOptions[] = [];

        BLOCKCHAIN_LIST.map(blockchain => {
            const reduxObject = preferences.networks[blockchain];

            const network =
                reduxObject === undefined
                    ? getBlockchain(blockchain).config.networks
                    : preferences.networks[blockchain];

            if (hasNetwork(blockchain, preferences.testNet)) {
                if (blockchain === Blockchain.NEAR) {
                    if (isFeatureActive(RemoteFeature.NEAR) === true) {
                        networks[blockchain] = network;
                    }
                } else if (blockchain === Blockchain.COSMOS) {
                    if (isFeatureActive(RemoteFeature.COSMOS) === true) {
                        networks[blockchain] = network;
                    }
                } else if (blockchain === Blockchain.CELO) {
                    if (isFeatureActive(RemoteFeature.CELO) === true) {
                        networks[blockchain] = network;
                    }
                } else {
                    networks[blockchain] = network;
                }
            }
        });

        return networks;
    }
);

export const getBlockchainsPortfolio = createSelector(
    (state: IReduxState) => state.preferences,
    (preferences: IPrefState) => {
        const list: IBlockchainsOptions[] = [];

        BLOCKCHAIN_LIST.map(blockchain => {
            const config = getBlockchain(blockchain).config;
            const reduxObject = preferences?.blockchains && preferences?.blockchains[blockchain];

            let blockchainObject: IBlockchainOptions;
            if (reduxObject === undefined) {
                blockchainObject = { order: config.defaultOrder, active: true };
            } else {
                let option: IBlockchainOptions;
                if (reduxObject.order === undefined) {
                    option = {
                        order: config.defaultOrder,
                        active: reduxObject.active
                    };
                } else {
                    option = reduxObject;
                }
                blockchainObject = option;
            }

            if (blockchain === Blockchain.NEAR) {
                if (isFeatureActive(RemoteFeature.NEAR) === true) {
                    list[blockchain] = blockchainObject;
                }
            } else if (blockchain === Blockchain.COSMOS) {
                if (isFeatureActive(RemoteFeature.COSMOS) === true) {
                    list[blockchain] = blockchainObject;
                }
            } else if (blockchain === Blockchain.CELO) {
                if (isFeatureActive(RemoteFeature.CELO) === true) {
                    list[blockchain] = blockchainObject;
                }
            } else {
                if (blockchainObject) {
                    list[blockchain] = blockchainObject;
                }
            }
        });

        return Object.keys(list)
            .map(key => ({ key, value: list[key] }))
            .sort((a, b) => a.value.order - b.value.order);
    }
);

export const hasNetwork = (blockchain: Blockchain, isTestNet: boolean) => {
    const networks = getBlockchain(blockchain).config.networks;
    if (isTestNet) {
        if (networks.testNet !== undefined) {
            return true;
        } else {
            return false;
        }
    } else {
        if (networks.mainNet !== undefined) {
            return true;
        } else {
            return false;
        }
    }
};

export const getNrActiveBlockchains = createSelector(
    (state: IReduxState) => state.preferences,
    (state: IReduxState) => getBlockchainsPortfolio(state),
    (preferences: IPrefState, portfolio: [{ key: Blockchain; value: IBlockchainOptions }]) => {
        let nrActiveBlockchains = 0;

        portfolio.map(object => {
            let blockchain;
            const { active } = object.value;
            blockchain =
                active && hasNetwork(object.key, preferences.testNet) ? object.key : undefined;

            if (blockchain) {
                nrActiveBlockchains++;
            }
        });

        return nrActiveBlockchains;
    }
);

export const getBlockchains = createSelector(
    (state: IReduxState) => state.preferences,
    (state: IReduxState) => getBlockchainsPortfolio(state),
    (preferences: IPrefState, portfolio: [{ key: Blockchain; value: IBlockchainOptions }]) => {
        const blockchains: Blockchain[] = [];

        portfolio.map(object => {
            let blockchain;
            const { active } = object.value;
            blockchain =
                active && hasNetwork(object.key, preferences.testNet) ? object.key : undefined;

            if (blockchain) {
                blockchains.push(object.key);
            }
        });

        return blockchains;
    }
);
