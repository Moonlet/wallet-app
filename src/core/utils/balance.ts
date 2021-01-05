import { IAccountState } from '../../redux/wallets/state';

import BigNumber from 'bignumber.js';

import { getBlockchain } from '../blockchain/blockchain-factory';
import { Blockchain, ChainIdType } from '../blockchain/types';
import { IExchangeRates } from '../../redux/market/state';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { ITokenConfigState } from '../../redux/tokens/state';

export const calculateBalance = (
    account: IAccountState,
    chainId: ChainIdType,
    exchangeRates: IExchangeRates,
    blockchainCoinTokenConfig: ITokenConfigState,
    cumulativeBalance: boolean
) => {
    const tokenKeys = Object.keys((account?.tokens || {})[chainId] || {});
    let balance = new BigNumber(0);

    const blockchainInstance = getBlockchain(account.blockchain);

    for (const tokenSymbol of tokenKeys) {
        const token = account.tokens[chainId][tokenSymbol];
        const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

        const tokenBalanceValue = new BigNumber(token.balance?.total);

        if (tokenConfig && token.active) {
            let amount = new BigNumber(0);

            if (tokenConfig.removable === false) {
                amount = tokenBalanceValue;
            } else {
                const amountConverted = convertAmount(
                    account.blockchain,
                    exchangeRates,
                    tokenBalanceValue.toFixed(),
                    tokenSymbol,
                    blockchainCoinTokenConfig.symbol,
                    tokenConfig.decimals
                );
                amount = blockchainInstance.account.amountToStd(
                    new BigNumber(amountConverted),
                    blockchainCoinTokenConfig.decimals
                );
            }

            if (cumulativeBalance === true) {
                // Cumulative Balance
                // balance of all portfolio
                balance = balance.plus(amount);
            } else {
                // No Cumulative Balance
                // add only the balance of the native coin
                if (tokenSymbol === blockchainInstance.config.coin) {
                    balance = balance.plus(amount);
                } else {
                    // skip, do not add the balance of non native coins
                }
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

export const splitStake = (amount: BigNumber, validators: number): BigNumber => {
    return new BigNumber(amount || 0).dividedBy(validators);
};
