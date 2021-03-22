import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { store } from '../config';
import { ITokenConfigState } from './state';
import { IAccountState, ITokensAccountState, ITokenState } from '../wallets/state';
import { getChainId } from '../preferences/selectors';
import { addTokenForBlockchain } from './actions';
import { pickInsensitiveKey } from '../../core/utils/pick';

export const getTokenConfig = (blockchain: Blockchain, symbol: string): ITokenConfigState => {
    const blockchainTokens = getBlockchain(blockchain).config.tokens;
    const state = store.getState();
    const chainId = getChainId(state, blockchain);

    const reduxToken = state.tokens;
    if (reduxToken[blockchain] && reduxToken[blockchain][chainId]) {
        const token = pickInsensitiveKey(reduxToken[blockchain][chainId], symbol);
        if (token) return token;
    }

    const blockchainToken = pickInsensitiveKey(blockchainTokens, symbol);
    if (blockchainToken) {
        return blockchainToken;
    }
};

export const generateTokensConfig = (blockchain: Blockchain): ITokensAccountState => {
    const blockchainConfig = getBlockchain(blockchain).config;

    // Generate tokens

    const tokenList: ITokensAccountState = {};
    for (const chainId of Object.values(blockchainConfig.networks)) {
        const tokenValue = {};

        for (const symbolKey of Object.keys(blockchainConfig.tokens)) {
            const order = blockchainConfig.tokens[symbolKey].defaultOrder || 0;
            tokenValue[symbolKey] = accountToken(symbolKey, order);
        }

        tokenList[chainId] = tokenValue;
    }

    // Add Auto Added Visible Tokens

    const tokens = blockchainConfig.autoAddedTokensSymbols;

    for (const chainId of Object.keys(tokens)) {
        for (const symbolKey of Object.keys(tokens[chainId])) {
            store.dispatch(
                addTokenForBlockchain(blockchain, tokens[chainId][symbolKey], chainId) as any
            );

            const order = tokens[chainId][symbolKey].defaultOrder || 999;
            tokenList[chainId] = {
                ...tokenList[chainId],
                [symbolKey]: accountToken(symbolKey, order)
            };
        }
    }

    // Add Auto Added Hidden Tokens

    const invisibleTokens = blockchainConfig?.autoAddedHiddenTokensSymbols || {};

    for (const chainId of Object.keys(invisibleTokens)) {
        for (const symbolKey of Object.keys(invisibleTokens[chainId])) {
            store.dispatch(
                addTokenForBlockchain(
                    blockchain,
                    invisibleTokens[chainId][symbolKey],
                    chainId
                ) as any
            );

            const order = invisibleTokens[chainId][symbolKey].defaultOrder || 999;
            tokenList[chainId] = {
                ...tokenList[chainId],
                [symbolKey]: accountToken(symbolKey, order, {
                    active: false
                })
            };
        }
    }

    return tokenList;
};

export const accountToken = (
    symbolKey: string,
    order: number,
    options?: { active?: boolean }
): ITokenState => {
    return {
        symbol: symbolKey,
        order,
        active: options?.active !== undefined ? options.active : true,
        balance: {
            value: '0',
            inProgress: false,
            timestamp: undefined,
            error: undefined,
            available: '0',
            total: '0',
            detailed: {}
        }
    };
};

export const generateAccountTokenState = (
    token: ITokenConfigState,
    account?: IAccountState,
    chainId?: ChainIdType
): ITokenState => {
    let order = 0;

    if (account) {
        const state = store.getState();

        const chainIdValue = chainId ? chainId : getChainId(state, account.blockchain);
        if (account.tokens[chainIdValue]) {
            order =
                Object.values(account.tokens[chainIdValue]).sort((x, y) => y.order - x.order)[0]
                    ?.order || 0 + 1;
        }
    }
    return {
        symbol: token.symbol,
        order: token.defaultOrder || order,
        active: true,
        balance: {
            value: '0',
            inProgress: false,
            timestamp: undefined,
            error: undefined,
            available: '0',
            total: '0',
            detailed: {}
        }
    };
};
