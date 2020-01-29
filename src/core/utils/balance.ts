import { IAccountState } from '../../redux/wallets/state';

import BigNumber from 'bignumber.js';

import { TokenType } from '../blockchain/types/token';

import { getBlockchain } from '../blockchain/blockchain-factory';
import { Blockchain } from '../blockchain/types';

export const calculateBalance = (account: IAccountState, exchangeRates: any) => {
    const tokenKeys = Object.keys(account.tokens);
    let balance = new BigNumber(0);

    tokenKeys.map(key => {
        const token = account.tokens[key];
        const tokenBalanceValue = new BigNumber(token.balance?.value);
        if (token.active) {
            if (token.type === TokenType.NATIVE) {
                balance = balance.plus(tokenBalanceValue);
            } else {
                const amount = convertAmount(
                    account.blockchain,
                    exchangeRates,
                    tokenBalanceValue.toString(),
                    key,
                    getBlockchain(account.blockchain).config.coin,
                    token.decimals
                );
                balance = balance.plus(amount);
            }
        }
    });
    return balance.toString();
};

export const convertAmount = (
    blockchain: Blockchain,
    exchangeRates: any,
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

    if (value && exchangeRates[fromToken]) {
        if (exchangeRates[fromToken][toToken]) {
            // direct conversion is possible
            return amount.multipliedBy(exchangeRates[fromToken][toToken]);
        } else {
            // direct conversion not possible
            const avTokens = Object.keys(exchangeRates[fromToken]);
            for (const avToken of avTokens) {
                if (exchangeRates[avToken] && exchangeRates[avToken][toToken]) {
                    return amount
                        .multipliedBy(exchangeRates[fromToken][avToken])
                        .multipliedBy(exchangeRates[avToken][toToken]);
                }
            }
        }
    }

    return new BigNumber(0);
};
