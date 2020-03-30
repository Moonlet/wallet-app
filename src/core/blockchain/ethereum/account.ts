import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain } from '../types';
import * as Util from 'ethereumjs-util';
import { BigNumber } from 'bignumber.js';
import { convert } from '../common/account';
import { config } from './config';
import HDNode from 'hdkey';
import { generateTokensConfig } from '../../../redux/tokens/static-selectors';

export const getAccountDerivationPath = (accountIndex): string => {
    return `${accountIndex}`;
};

export const getPrivateKeyFromDerived = (derivedKey: HDNode): string => {
    return derivedKey.privateKey.toString('hex');
};

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
        selected: false,
        publicKey: privateToPublic(privateKey),
        address: privateToAddress(privateKey),
        blockchain: Blockchain.ETHEREUM,
        tokens: generateTokensConfig(Blockchain.ETHEREUM)
    };
};

export const amountToStd = (
    value: BigNumber | number | string,
    decimals: number = config.tokens[config.coin].decimals
): BigNumber => {
    return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
};

export const amountFromStd = (
    value: BigNumber | number | string,
    decimals: number = config.tokens[config.coin].decimals
): BigNumber => {
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
};

export const convertUnit = (value: BigNumber, from: string, to: string): BigNumber => {
    return convert(value, from, to, config);
};
