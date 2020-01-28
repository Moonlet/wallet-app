import { IBlockchainConfig } from '../types';
import { BigNumber } from 'bignumber.js';
import { IAccountState } from '../../../redux/wallets/state';
import { TokenType } from '../types/token';
import { getBlockchain } from '../blockchain-factory';

export const convert = (
    value: BigNumber,
    fromUnit: string,
    toUnit: string,
    info: IBlockchainConfig
): BigNumber => {
    if (fromUnit === toUnit) {
        return value;
    }

    if (info) {
        const units = info.tokens[info.coin].units;
        if (units[fromUnit] && units[toUnit]) {
            return value.multipliedBy(units[fromUnit]).dividedBy(units[toUnit]);
        } else {
            throw new Error(`${fromUnit} or ${toUnit} is not configured as a unit.`);
        }
    } else {
        throw new Error(`Blockchain  is not configured.`);
    }
};

export const calculateBalance = (account: IAccountState) => {
    const tokenKeys = Object.keys(account.tokens);
    let balance = new BigNumber(0);

    tokenKeys.map(key => {
        const token = account.tokens[key];
        const tokenBalanceValue = new BigNumber(token.balance?.value);
        if (token.active) {
            if (token.type === TokenType.NATIVE) {
                balance = balance.plus(tokenBalanceValue);
            } else {
                const exchange = this.props.exchangeRates[key][
                    getBlockchain(account.blockchain).config.coin
                ];
                balance = balance.plus(tokenBalanceValue.multipliedBy(exchange));
            }
        }
    });
    return balance.toString();
};
