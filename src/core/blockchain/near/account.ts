import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain } from '../types';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convert } from '../common/account';

import bs58 from 'bs58';
import * as nacl from 'tweetnacl';
import { HDKeyEd25519 } from '../../wallet/hd-wallet/hd-key/hd-key-ed25519';
import { convertTokenConfig } from '../../../redux/tokens/static-selectors';

export const getAccountDerivationPath = (accountIndex): string => {
    return `${accountIndex}'`;
};

export const getPrivateKeyFromDerived = (derivedKey: HDKeyEd25519): string => {
    const keyPair = nacl.sign.keyPair.fromSeed(derivedKey.key);
    return bs58.encode(Buffer.from(keyPair.secretKey));
};

export const isValidChecksumAddress = (address: string): boolean => {
    return true;
};

export const isValidAddress = (address: string): boolean => {
    return false;
};

export const publicToAddress = (publicKey: string): string => {
    return publicKey;
};

export const privateToPublic = (privateKey: string): string => {
    const keyPair = nacl.sign.keyPair.fromSecretKey(bs58.decode(privateKey));
    return 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey));
};

export const privateToAddress = (privateKey: string): string => {
    return privateToPublic(privateKey);
};

export const getAccountFromPrivateKey = (privateKey: string, index: number): IAccountState => {
    const keyPair = nacl.sign.keyPair.fromSecretKey(bs58.decode(privateKey));

    const tokens = {};
    Object.keys(config.tokens).map(key => {
        const token = convertTokenConfig(config.tokens[config.defaultChainId][key]);
        tokens[key] = token;
    });

    return {
        index,
        selected: false,
        publicKey: 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey)),
        address: 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey)),
        blockchain: Blockchain.NEAR,
        tokens
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
