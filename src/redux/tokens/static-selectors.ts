import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { store } from '../config';
import { ITokenConfigState, ITokenState } from './state';
import { IAccountState, ITokensAccountState } from '../wallets/state';
import { getChainId } from '../preferences/selectors';

export const getTokenConfig = (blockchain: Blockchain, symbol: string): ITokenConfigState => {
    const blockchainToken = getBlockchain(blockchain).config.tokens;
    const state = store.getState();
    const chainId = getChainId(state, blockchain);

    if (blockchainToken[chainId][symbol]) {
        return blockchainToken[chainId][symbol];
    }

    const reduxToken = state.tokens;

    return reduxToken[blockchain][chainId][symbol];
};

export const generateTokensConfig = (blockchain: Blockchain): ITokensAccountState => {
    const tokens = getBlockchain(blockchain).config.tokens;

    const tokenList: ITokensAccountState = {};
    Object.keys(tokens).map(chainIdKey => {
        const object = tokens[chainIdKey];
        const tokenValue = {};
        Object.keys(object).map(symbolKey => {
            const accountToken = {
                symbol: symbolKey,
                order: object[symbolKey].defaultOrder || 0,
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
        tokenList[chainIdKey] = tokenValue;
    });

    return tokenList;
};

export const convertTokenConfig = (
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

export const selectedChainId = (blockchain: Blockchain): ChainIdType => {
    const state = store.getState();
    return getChainId(state, blockchain);
};
