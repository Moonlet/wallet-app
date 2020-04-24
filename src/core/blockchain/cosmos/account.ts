import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain, IBlockchainAccountUtils } from '../types';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convert } from '../common/account';
import HDNode from 'hdkey';
import bech32 from 'bech32';
import { createHash } from 'crypto';
import secp256k1 from 'secp256k1';
import { generateTokensConfig } from '../../../redux/tokens/static-selectors';

export class CosmosAccountUtils implements IBlockchainAccountUtils {
    public getAccountDerivationPath = (accountIndex): string => {
        return `${accountIndex}`;
    };

    public getPrivateKeyFromDerived = (derivedKey: HDNode): string => {
        return derivedKey.privateKey.toString('hex');
    };

    public isValidChecksumAddress = (address: string): boolean => {
        return this.isValidAddress(address);
    };

    public isValidAddress = (address: string): boolean => {
        return /^cosmos1[0-9a-zA-Z]{38}$/.test(address) && bech32.decode(address) !== undefined;
    };

    public publicToAddress = (publicKey: string): string => {
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

    public privateToPublic = (privateKey: string): string => {
        const bufferPrivateKey = Buffer.from(privateKey, 'hex');

        // @ts-ignore
        return secp256k1.publicKeyCreate(bufferPrivateKey, true).toString('hex');
    };

    public privateToAddress = (privateKey: string): string => {
        return this.publicToAddress(this.privateToPublic(privateKey));
    };

    public getAccountFromPrivateKey = (privateKey: string, index: number): IAccountState => {
        return {
            index,
            selected: false,
            publicKey: this.privateToPublic(privateKey),
            address: this.privateToAddress(privateKey),
            blockchain: Blockchain.COSMOS,
            tokens: generateTokensConfig(Blockchain.COSMOS)
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
