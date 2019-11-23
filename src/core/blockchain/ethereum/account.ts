import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain } from '../types';
import * as Util from 'ethereumjs-util';
import { BigNumber } from 'bignumber.js';
import { convertUnit } from '../common/account';
import { config } from './config';
import { IResultValidation } from '../../wallet/types';

export const isValidChecksumAddress = (address: string): boolean => {
    return Util.isValidChecksumAddress(address);
};

export const isValidAddress = (address: string): IResultValidation => {
    if (Util.isValidAddress(address)) {
        if (isValidChecksumAddress(address)) {
            return { valid: true };
        } else {
            return { valid: true, responseType: 'warning' };
        }
    } else {
        return {
            valid: false,
            responseType: 'error'
        };
    }
};

export const publicToAddress = (publicKey: string): string => {
    return Util.toChecksumAddress(
        Util.publicToAddress(Buffer.from(publicKey, 'hex')).toString('hex')
    );
};

export const privateToPublic = (privateKey: string): string => {
    return Util.privateToPublic(Buffer.from(privateKey, 'hex')).toString('hex');
};

export const privateToAddress = (privateKey: string): string => {
    return Util.toChecksumAddress(
        Util.privateToAddress(Buffer.from(privateKey, 'hex')).toString('hex')
    );
};

export const getAccountFromPrivateKey = (privateKey: string, index: number): IAccountState => {
    return {
        index,
        publicKey: privateToPublic(privateKey),
        address: privateToAddress(privateKey),
        blockchain: Blockchain.ETHEREUM
    };
};

export const amountToStd = (value: BigNumber | number | string): BigNumber => {
    return convertUnit(new BigNumber(Number(value)), config.coin, config.defaultUnit, config);
};

export const amountFromStd = (value: BigNumber): BigNumber => {
    return convertUnit(value, config.defaultUnit, config.coin, config);
};

export const convertToGasPriceUnit = (value: BigNumber): BigNumber => {
    return convertUnit(value, config.defaultUnit, config.feeOptions.ui.gasPriceUnit, config);
};

export const convertFromGasPriceUnit = (value: BigNumber): BigNumber => {
    return convertUnit(value, config.feeOptions.ui.gasPriceUnit, config.defaultUnit, config);
};
