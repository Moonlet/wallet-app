import { IAccountState } from '../../../redux/wallets/state';
import {
    getPubKeyFromPrivateKey,
    getAddressFromPrivateKey,
    getAddressFromPublicKey
} from '@zilliqa-js/crypto/dist/util'; // import like this to optimize imports
import { toBech32Address, fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { Blockchain } from '../types';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convert } from '../common/account';
import HDNode from 'hdkey';
import { generateTokensConfig } from '../../../redux/tokens/static-selectors';

export const getAccountDerivationPath = (accountIndex): string => {
    return `${accountIndex}`;
};

export const getPrivateKeyFromDerived = (derivedKey: HDNode): string => {
    return derivedKey.privateKey.toString('hex');
};

export const isValidChecksumAddress = (address: string): boolean => {
    return isBech32(address) && fromBech32Address(address) !== undefined;
};

export const isValidAddress = (address: string): boolean => {
    return isBech32(address) && fromBech32Address(address) !== undefined;
};

export const publicToAddress = (publicKey: string): string => {
    return toBech32Address(getAddressFromPublicKey(publicKey));
};

export const privateToPublic = (privateKey: string): string => {
    return getPubKeyFromPrivateKey(privateKey);
};

export const privateToAddress = (privateKey: string): string => {
    return toBech32Address(getAddressFromPrivateKey(privateKey));
};

export const getAccountFromPrivateKey = (privateKey: string, index: number): IAccountState => {
    return {
        index,
        selected: false,
        publicKey: privateToPublic(privateKey),
        address: privateToAddress(privateKey),
        blockchain: Blockchain.ZILLIQA,
        tokens: generateTokensConfig(Blockchain.ZILLIQA)
    };
};

export const amountToStd = (
    value: BigNumber | number | string,
    decimals: number = config.tokens[config.defaultChainId][config.coin].decimals
): BigNumber => {
    return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
};

export const amountFromStd = (
    value: BigNumber | number | string,
    decimals: number = config.tokens[config.defaultChainId][config.coin].decimals
): BigNumber => {
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
};

export const convertUnit = (value: BigNumber, from: string, to: string): BigNumber => {
    return convert(value, from, to, config);
};
