import { IAccountState } from '../../../redux/wallets/state';
import {
    getPubKeyFromPrivateKey,
    getAddressFromPrivateKey,
    getAddressFromPublicKey
} from '@zilliqa-js/crypto/dist/util'; // import like this to optimize imports
import { toBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { Blockchain } from '../types';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convertUnit } from '../common/account';

export const isValidChecksumAddress = (address: string): boolean => {
    return isBech32(address);
};

export const isValidAddress = (address: string): boolean => {
    return isBech32(address);
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
        publicKey: privateToPublic(privateKey),
        address: privateToAddress(privateKey),
        blockchain: Blockchain.ZILLIQA
    };
};

export const amountToStd = (value: string): BigNumber => {
    return convertUnit(
        Blockchain.ZILLIQA,
        new BigNumber(Number(value)),
        config.coin,
        config.defaultUnit,
        config
    );
};

export const amountFromStd = (value: BigNumber): BigNumber => {
    return convertUnit(Blockchain.ZILLIQA, value, config.defaultUnit, config.coin, config);
};
