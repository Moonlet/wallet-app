import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain } from '../types';
import * as Util from 'ethereumjs-util';
import { BigNumber } from 'bignumber.js';
import { convert } from '../common/account';
import { config } from './config';

export const isValidChecksumAddress = (address: string): boolean => {
    return Util.isValidChecksumAddress(address);
};

export const isValidAddress = (address: string): boolean => {
    return Util.isValidAddress(address);
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
    return convert(new BigNumber(value), config.coin, config.defaultUnit, config);
};

export const amountFromStd = (value: BigNumber): BigNumber => {
    return convert(value, config.defaultUnit, config.coin, config);
};

export const convertUnit = (value: BigNumber, from: string, to: string): BigNumber => {
    return convert(value, from, to, config);
};
