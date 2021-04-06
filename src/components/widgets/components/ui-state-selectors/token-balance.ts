import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { formatNumber } from '../../../../core/utils/format-number';
import { pickInsensitiveKey } from '../../../../core/utils/pick';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../redux/state';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { getSelectedAccount } from '../../../../redux/wallets/selectors';
import { IScreenModule } from '../../types';

export const getTokenAvailableBalanceFormat = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);

    const tokenSymbol = params && params[0];

    const token = pickInsensitiveKey(account.tokens[chainId], tokenSymbol);

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const balance = new BigNumber(token.balance?.available || '0');

    const amountFromStd = blockchainInstance.account.amountFromStd(balance, tokenConfig.decimals);

    return formatNumber(amountFromStd, {
        currency: tokenConfig.symbol
    });
};

export const getTokenAvailableBalance = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);

    const tokenSymbol = params && params[0];

    const token = pickInsensitiveKey(account.tokens[chainId], tokenSymbol);

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const balance = new BigNumber(token.balance?.available || '0');

    return blockchainInstance.account.amountFromStd(balance, tokenConfig.decimals);
};
