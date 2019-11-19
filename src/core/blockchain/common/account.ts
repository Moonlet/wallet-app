import { Blockchain } from '../types';
import { BigNumber } from 'bignumber.js';

export const convertUnit = (
    blockchain: Blockchain,
    value: BigNumber,
    fromUnit,
    toUnit,
    info
): BigNumber => {
    if (fromUnit === toUnit) {
        return value;
    }
    const object = new BigNumber(value);

    if (info) {
        if (info.units[fromUnit] && info.units[toUnit]) {
            return object.multipliedBy(info.units[fromUnit]).dividedBy(info.units[toUnit]);
        } else {
            throw new Error(`${fromUnit} or ${toUnit} is not configured as a unit.`);
        }
    } else {
        throw new Error(`Blockchain ${blockchain} is not configured.`);
    }
};
