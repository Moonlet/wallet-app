import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain } from '../types';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convert } from '../common/account';
import HDNode from 'hdkey';
import klona from 'klona';
import bech32 from 'bech32';
import { createHash } from 'crypto';
import secp256k1 from 'secp256k1';

export const ADDRESS_PREFIX = 'cosmos';

export const getAccountDerivationPath = (accountIndex): string => {
    return `${accountIndex}`;
};

export const getPrivateKeyFromDerived = (derivedKey: HDNode): string => {
    return derivedKey.privateKey.toString('hex');
};

export const isValidChecksumAddress = (address: string): boolean => {
    return isValidAddress(address);
};

export const isValidAddress = (address: string): boolean => {
    return /^cosmos1[0-9a-zA-Z]{38}$/.test(address);
};

export const publicToAddress = (publicKey: string): string => {
    const sha = createHash('sha256')
        .update(Buffer.from(publicKey, 'hex'))
        .digest();
    const words = bech32.toWords(
        createHash('ripemd160')
            .update(sha)
            .digest()
    );
    return bech32.encode('cosmos', words);
};

export const privateToPublic = (privateKey: string): string => {
    const bufferPrivateKey = Buffer.from(privateKey, 'hex');

    // @ts-ignore
    return secp256k1.publicKeyCreate(bufferPrivateKey, true).toString('hex');
};

export const privateToAddress = (privateKey: string): string => {
    return publicToAddress(privateToPublic(privateKey));
};

export const getAccountFromPrivateKey = (privateKey: string, index: number): IAccountState => {
    return {
        index,
        selected: false,
        publicKey: privateToPublic(privateKey),
        address: privateToAddress(privateKey),
        blockchain: Blockchain.COSMOS,
        tokens: klona(config.tokens)
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
