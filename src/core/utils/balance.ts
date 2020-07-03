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

    tokenKeys.map(key => {
        const token = account.tokens[chainId][key];
        const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

        const tokenBalanceValue = new BigNumber(token.balance?.value);

        if (token.active && tokenConfig) {
            if (tokenConfig.removable === false) {
                balance = balance.plus(tokenBalanceValue);
            } else {
                const amount = convertAmount(
                    account.blockchain,
                    exchangeRates,
                    tokenBalanceValue.toString(),
                    key,
                    tokenConfig.symbol,
                    tokenConfig.decimals
                );
                balance = balance.plus(amount);
            }
        }
    });
    return balance.toString();
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
