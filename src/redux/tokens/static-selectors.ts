import { Blockchain } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { store } from '../config';
import { ITokenConfigState } from './state';
import { IAccountState, ITokensAccountState, ITokenState } from '../wallets/state';
import { getChainId } from '../preferences/selectors';

export const getTokenConfig = (blockchain: Blockchain, symbol: string): ITokenConfigState => {
    const blockchainTokens = getBlockchain(blockchain).config.tokens;
    const state = store.getState();
    const chainId = getChainId(state, blockchain);

    if (blockchainTokens[symbol]) {
        return blockchainTokens[symbol];
    }

    const reduxToken = state.tokens;

    return reduxToken[blockchain][chainId][symbol];
};

export const generateTokensConfig = (blockchain: Blockchain): ITokensAccountState => {
    const blockchainConfig = getBlockchain(blockchain).config;

    const tokenList: ITokensAccountState = {};
    Object.values(blockchainConfig.networks).map(chainId => {
        const tokenValue = {};
        Object.keys(blockchainConfig.tokens).map(symbolKey => {
            const accountToken = {
                symbol: symbolKey,
                order: blockchainConfig.tokens[symbolKey].defaultOrder || 0,
                active: true,
                balance: {
                    value: '0',
                    inProgress: false,
                    timestamp: undefined,
                    error: undefined
                }
            };
            tokenValue[symbolKey] = accountToken;
        });
        tokenList[chainId] = tokenValue;
    });

    return tokenList;
};

export const generateAccountTokenState = (
    token: ITokenConfigState,
    account?: IAccountState
): ITokenState => {
    let order = 0;

    if (account) {
        const state = store.getState();
        const chainId = getChainId(state, account.blockchain);
        order =
            Object.values(account.tokens[chainId]).sort((x, y) => y.order - x.order)[0]?.order ||
            0 + 1;
    }
    return {
        symbol: token.symbol,
        order: token.defaultOrder || order,
        active: true,
        balance: {
            value: '0',
            inProgress: false,
            timestamp: undefined,
            error: undefined
        }
    };
};
