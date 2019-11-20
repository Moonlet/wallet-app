import { IBlockchainConfig } from '../types';
import { BigNumber } from 'bignumber.js';

export const convertUnit = (
    value: BigNumber,
    fromUnit: string,
    toUnit: string,
    info: IBlockchainConfig
): BigNumber => {
    if (fromUnit === toUnit) {
        return value;
    }

    if (info) {
        if (info.units[fromUnit] && info.units[toUnit]) {
            return value.multipliedBy(info.units[fromUnit]).dividedBy(info.units[toUnit]);
        } else {
            throw new Error(`${fromUnit} or ${toUnit} is not configured as a unit.`);
        }
    } else {
        throw new Error(`Blockchain  is not configured.`);
    }
};
