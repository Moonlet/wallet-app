import { IAccountState } from '../../redux/wallets/state';

import BigNumber from 'bignumber.js';

import { getBlockchain } from '../blockchain/blockchain-factory';
import { Blockchain, ChainIdType } from '../blockchain/types';
import { IExchangeRates } from '../../redux/market/state';
import { getTokenConfig } from '../../redux/tokens/static-selectors';

export const calculateBalance = (
    account: IAccountState,
    chainId: ChainIdType,
    exchangeRates: IExchangeRates
) => {
    const tokenKeys = Object.keys((account?.tokens || {})[chainId] || {});
    let balance = new BigNumber(0);

    const blockchainCoinTokenConfig = getTokenConfig(
        account.blockchain,
        getBlockchain(account.blockchain).config.coin
    );

    for (const tokenSymbol of tokenKeys) {
        const token = account.tokens[chainId][tokenSymbol];
        const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

        const tokenBalanceValue = new BigNumber(token.balance?.value);

        if (tokenConfig && token.active) {
            if (tokenConfig.removable === false) {
                balance = balance.plus(tokenBalanceValue);
            } else {
                const amount = convertAmount(
                    account.blockchain,
                    exchangeRates,
                    tokenBalanceValue.toFixed(),
                    tokenSymbol,
                    blockchainCoinTokenConfig.symbol,
                    tokenConfig.decimals
                );
                const amountStd = getBlockchain(account.blockchain).account.amountToStd(
                    new BigNumber(amount),
                    blockchainCoinTokenConfig.decimals
                );
                balance = balance.plus(amountStd);
            }
        }
    }

    return balance.toFixed();
};

export const convertAmount = (
    blockchain: Blockchain,
    exchangeRates: IExchangeRates,
    value: string,
    fromToken: string,
    toToken: string,
    tokenDecimals: number
): BigNumber => {
    const blockchainInstance = getBlockchain(blockchain);
    const valueBigNumber = new BigNumber(value);
    const amount = blockchainInstance.account.amountFromStd(valueBigNumber, tokenDecimals);
    if (fromToken === toToken) {
        return amount;
    }

    if (value && exchangeRates[fromToken] && exchangeRates[toToken]) {
        return amount.multipliedBy(exchangeRates[fromToken]).dividedBy(exchangeRates[toToken]);
    }

    return new BigNumber(0);
};
