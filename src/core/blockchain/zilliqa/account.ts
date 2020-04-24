import { IAccountState } from '../../../redux/wallets/state';
import {
    getPubKeyFromPrivateKey,
    getAddressFromPrivateKey,
    getAddressFromPublicKey
} from '@zilliqa-js/crypto/dist/util'; // import like this to optimize imports
import { toBech32Address, fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { Blockchain, IBlockchainAccountUtils } from '../types';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convert } from '../common/account';
import HDNode from 'hdkey';
import { generateTokensConfig } from '../../../redux/tokens/static-selectors';

export class ZilliqaAccountUtils implements IBlockchainAccountUtils {
    public getAccountDerivationPath = (accountIndex): string => {
        return `${accountIndex}`;
    };

    public getPrivateKeyFromDerived = (derivedKey: HDNode): string => {
        return derivedKey.privateKey.toString('hex');
    };

    public isValidChecksumAddress = (address: string): boolean => {
        return isBech32(address) && fromBech32Address(address) !== undefined;
    };

    public isValidAddress = (address: string): boolean => {
        return isBech32(address) && fromBech32Address(address) !== undefined;
    };

    public publicToAddress = (publicKey: string): string => {
        return toBech32Address(getAddressFromPublicKey(publicKey));
    };

    public privateToPublic = (privateKey: string): string => {
        return getPubKeyFromPrivateKey(privateKey);
    };

    public privateToAddress = (privateKey: string): string => {
        return toBech32Address(getAddressFromPrivateKey(privateKey));
    };

    public getAccountFromPrivateKey = (privateKey: string, index: number): IAccountState => {
        return {
            index,
            selected: false,
            publicKey: this.privateToPublic(privateKey),
            address: this.privateToAddress(privateKey),
            blockchain: Blockchain.ZILLIQA,
            tokens: generateTokensConfig(Blockchain.ZILLIQA)
        };
    };

    public amountToStd = (
        value: BigNumber | number | string,
        decimals: number = config.tokens[config.coin].decimals
    ): BigNumber => {
        return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
    };

    public amountFromStd = (
        value: BigNumber | number | string,
        decimals: number = config.tokens[config.coin].decimals
    ): BigNumber => {
        return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
    };

    public convertUnit = (value: BigNumber, from: string, to: string): BigNumber => {
        return convert(value, from, to, config);
    };
}
