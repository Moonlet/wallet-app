import { IAccountState, TokenType } from '../../../redux/wallets/state';
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
        blockchain: Blockchain.ETHEREUM,
        tokens: {
            ETH: {
                name: 'Ethereum',
                symbol: 'ETH',
                logo: '', // use a dummy logo for now
                type: TokenType.NATIVE,
                contractAddress: privateToPublic(privateKey),
                order: 0,
                active: true,
                decimals: 18,
                uiDecimals: 4,
                balance: {
                    value: new BigNumber(0), // check here
                    inProgress: false,
                    timestamp: 0,
                    error: undefined
                }
            }
            // MKR: {
            //     name: 'Maker',
            //     symbol: 'MKR',
            //     logo: '', // use a dummy logo for now
            //     type: TokenType.ERC20, // TokenType (Native, ERC20, ...)
            //     contractAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
            //     order: 1,
            //     active: false,
            //     decimals: 18,
            //     uiDecimals: 4,
            //     balance: {
            //         value: new BigNumber(0),
            //         inProgress: false,
            //         timestamp: 0,
            //         error: undefined
            //     }
            // }
        }
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
