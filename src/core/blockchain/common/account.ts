import { IBlockchainConfig } from '../types';
import { BigNumber } from 'bignumber.js';

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
        const units = info.tokens[info.defaultChainId][info.coin].units;
        if (units[fromUnit] && units[toUnit]) {
            return value.multipliedBy(units[fromUnit]).dividedBy(units[toUnit]);
        } else {
            throw new Error(`${fromUnit} or ${toUnit} is not configured as a unit.`);
        }
    } else {
        throw new Error(`Blockchain  is not configured.`);
    }
};
