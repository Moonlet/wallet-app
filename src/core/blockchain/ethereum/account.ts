import { AccountType, IAccountState } from '../../../redux/wallets/state';
import { Blockchain, IBlockchainAccountUtils } from '../types';
import * as Util from 'ethereumjs-util';
import { BigNumber } from 'bignumber.js';
import { convert } from '../common/account';
import { config } from './config';
import HDNode from 'hdkey';
import { generateTokensConfig } from '../../../redux/tokens/static-selectors';

export class EthereumAccountUtils implements IBlockchainAccountUtils {
    public getAccountDerivationPath(accountIndex: number): string {
        return `${accountIndex}`;
    }

    public getPrivateKeyFromDerived(derivedKey: HDNode): string {
        return derivedKey.privateKey.toString('hex');
    }

    public isValidChecksumAddress(address: string): boolean {
        return Util.isValidChecksumAddress(address);
    }

    public isValidAddress(address: string): boolean {
        return Util.isValidAddress(address);
    }

    public publicToAddress(publicKey: string): string {
        return Util.toChecksumAddress(
            Util.publicToAddress(Buffer.from(publicKey, 'hex')).toString('hex')
        );
    }

    public privateToPublic(privateKey: string): string {
        return Util.privateToPublic(Buffer.from(privateKey, 'hex')).toString('hex');
    }

    public privateToAddress(privateKey: string): string {
        return Util.toChecksumAddress(
            Util.privateToAddress(Buffer.from(privateKey, 'hex')).toString('hex')
        );
    }

    public getAccountFromPrivateKey(privateKey: string, index: number): IAccountState {
        return {
            index,
            type: AccountType.DEFAULT,
            selected: false,
            publicKey: this.privateToPublic(privateKey),
            address: this.privateToAddress(privateKey),
            blockchain: Blockchain.ETHEREUM,
            tokens: generateTokensConfig(Blockchain.ETHEREUM)
        };
    }

    public amountToStd(value: BigNumber | number | string, decimals: number): BigNumber {
        return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
    }

    public amountFromStd(value: BigNumber | number | string, decimals: number): BigNumber {
        return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
    }

    public convertUnit(value: BigNumber, from: string, to: string): BigNumber {
        return convert(value, from, to, config);
    }
}
