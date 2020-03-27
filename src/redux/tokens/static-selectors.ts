import { Blockchain } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { store } from '../config';
import { ITokenConfigState, ITokenState } from './state';
import { IAccountState } from '../wallets/state';

export const getTokenConfig = (blockchain: Blockchain, symbol: string): ITokenConfigState => {
    const blockchainToken = getBlockchain(blockchain).config.tokens[symbol];

    if (blockchainToken) {
        return blockchainToken;
    }
    const state = store.getState();

    const reduxToken = state.tokens;

    return reduxToken.undefined[symbol];
};

export const convertTokenConfig = (
    token: ITokenConfigState,
    account?: IAccountState
): ITokenState => {
    const order = 0;
    if (account) {
        Object.values(account.tokens).sort((x, y) => y.order - x.order)[0]?.order || 0 + 1;
    }
    return {
        symbol: token.symbol,
        order: token.defaultOrder || order,
        active: true,
        balance: {
            value: undefined,
            inProgress: false,
            timestamp: undefined,
            error: undefined
        }
    };
};
