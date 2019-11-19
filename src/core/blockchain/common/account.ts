import { Blockchain } from '../types';
import { BigNumber } from 'bignumber.js';
import { BLOCKCHAIN_INFO } from '../blockchain-factory';

export const convertUnit = (
    blockchain: Blockchain,
    value: BigNumber,
    fromUnit,
    toUnit
): BigNumber => {
    if (fromUnit === toUnit) {
        return value;
    }
    const object = new BigNumber(value);

    const info = BLOCKCHAIN_INFO[blockchain];

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
