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

    // generate tokens

    const tokenList: ITokensAccountState = {};
    Object.values(blockchainConfig.networks).map(chainId => {
        const tokenValue = {};
        Object.keys(blockchainConfig.tokens).map(symbolKey => {
            const order = blockchainConfig.tokens[symbolKey].defaultOrder || 0;
            tokenValue[symbolKey] = accountToken(symbolKey, order);
        });
        tokenList[chainId] = tokenValue;
    });

    const tokens = blockchainConfig.autoAddedTokensSymbols;
    Object.keys(tokens).map(chainId => {
        Object.keys(tokens[chainId]).map(symbolKey => {
            store.dispatch(
                addTokenForBlockchain(blockchain, tokens[chainId][symbolKey], chainId) as any
            );

            const order = tokens[chainId][symbolKey].defaultOrder || 999;
            tokenList[chainId] = {
                ...tokenList[chainId],
                [symbolKey]: accountToken(symbolKey, order)
            };
        });
    });

    return tokenList;
};

export const accountToken = (symbolKey: string, order: number): ITokenState => {
    return {
        symbol: symbolKey,
        order,
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
