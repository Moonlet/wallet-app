import { AccountType, IAccountState } from '../../../redux/wallets/state';

import { Blockchain, IBlockchainAccountUtils } from '../types';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convert } from '../common/account';
import { generateTokensConfig } from '../../../redux/tokens/static-selectors';
import { encode as bs58Encode, decode as bs58Decode } from 'bs58';
import * as nacl from 'tweetnacl';
import { HDKeyEd25519 } from '../../wallet/hd-wallet/hd-key/hd-key-ed25519';
import { translate } from '../../i18n';

export class SolanaAccountUtils implements IBlockchainAccountUtils {
    public getAccountDerivationPath(accountIndex): string {
        return `${accountIndex}'`;
    }

    public getPrivateKeyFromDerived(derivedKey: HDKeyEd25519): string {
        const keyPair = nacl.sign.keyPair.fromSeed(derivedKey.key);
        return bs58Encode(Buffer.from(keyPair.secretKey));
    }

    public isValidChecksumAddress(address: string): boolean {
        const decoded = bs58Decode(address);
        return decoded.length === 32;
    }

    public isValidAddress(address: string): boolean {
        const decoded = bs58Decode(address);
        return decoded.length === 32;
    }

    public publicToAddress(publicKey: string): string {
        return bs58Encode(Buffer.from(publicKey));
    }

    public privateToPublic(privateKey: string): string {
        const keyPair = nacl.sign.keyPair.fromSecretKey(bs58Decode(privateKey));
        return bs58Encode(Buffer.from(keyPair.publicKey));
    }

    public privateToAddress(privateKey: string): string {
        return this.privateToPublic(privateKey);
    }

    public getAccountFromPrivateKey(privateKey: string, index: number): IAccountState {
        return {
            index,
            type: index === -1 ? AccountType.ROOT : AccountType.DEFAULT,
            selected: false,
            publicKey: this.privateToPublic(privateKey),
            address: this.privateToAddress(privateKey),
            blockchain: Blockchain.SOLANA,
            tokens: generateTokensConfig(Blockchain.SOLANA),
            name: index === -1 ? translate('App.labels.rootAccount') : undefined
        };
    }

    public amountToStd(
        value: BigNumber | number | string,
        decimals: number = config.tokens[config.coin].decimals
    ): BigNumber {
        return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
    }

    amountFromStd(
        value: BigNumber | number | string,
        decimals: number = config.tokens[config.coin].decimals
    ): BigNumber {
        return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
    }

    convertUnit(value: BigNumber, from: string, to: string): BigNumber {
        return convert(value, from, to, config);
    }
}
