import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain } from '../types';
import * as Util from 'ethereumjs-util';
import { BigNumber } from 'bignumber.js';
import { convertUnit } from '../common/account';
import { BLOCKCHAIN_INFO } from '../blockchain-factory';

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

export const amountToStd = (value: string): BigNumber => {
    const info = BLOCKCHAIN_INFO[Blockchain.ETHEREUM];

    return convertUnit(
        Blockchain.ETHEREUM,
        new BigNumber(Number(value)),
        info.coin,
        info.defaultUnit
    );
};

export const amountFromStd = (value: BigNumber): BigNumber => {
    const info = BLOCKCHAIN_INFO[Blockchain.ETHEREUM];
    return convertUnit(Blockchain.ETHEREUM, value, info.defaultUnit, info.coin);
};
