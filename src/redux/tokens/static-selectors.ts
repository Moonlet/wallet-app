import { Blockchain } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { store } from '../config';
import { ITokenConfigState, ITokenState } from './state';
import { IAccountState } from '../wallets/state';
import { getChainId } from '../preferences/selectors';

export const getTokenConfig = (blockchain: Blockchain, symbol: string): ITokenConfigState => {
    const blockchainToken = getBlockchain(blockchain).config.tokens[symbol];
    const state = store.getState();
    const chainId = getChainId(state, blockchain);

    if (blockchainToken[chainId]) {
        return blockchainToken[chainId];
    }

    const reduxToken = state.tokens;

    return reduxToken[blockchain][chainId][symbol];
};

export const convertTokenConfig = (
    token: ITokenConfigState,
    account?: IAccountState
): ITokenState => {
    let order = 0;
    if (account) {
        order = Object.values(account.tokens).sort((x, y) => y.order - x.order)[0]?.order || 0 + 1;
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
