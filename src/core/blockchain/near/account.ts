import { AccountType, IAccountState } from '../../../redux/wallets/state';
import { Blockchain, IBlockchainAccountUtils } from '../types';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convert } from '../common/account';

import bs58 from 'bs58';
import * as nacl from 'tweetnacl';
import { HDKeyEd25519 } from '../../wallet/hd-wallet/hd-key/hd-key-ed25519';
import { generateTokensConfig } from '../../../redux/tokens/static-selectors';
import { sha256 } from 'js-sha256';
import { NEAR_LOCKUP_SUFFIX } from '../../constants/app';

export class NearAccountUtils implements IBlockchainAccountUtils {
    public getAccountDerivationPath(accountIndex: number): string {
        // all accounts are created / recovered using the first public-private key pair
        accountIndex = 0;
        return `${accountIndex}'`;
    }

    public getPrivateKeyFromDerived(derivedKey: HDKeyEd25519): string {
        const keyPair = nacl.sign.keyPair.fromSeed(derivedKey.key);
        return bs58.encode(Buffer.from(keyPair.secretKey));
    }

    public isValidChecksumAddress(address: string): boolean {
        return true;
    }

    public isValidAddress(address: string): boolean {
        return false;
    }

    public publicToAddress(publicKey: string): string {
        return publicKey;
    }

    public privateToPublic(privateKey: string): string {
        const keyPair = nacl.sign.keyPair.fromSecretKey(bs58.decode(privateKey));
        return 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey));
    }

    public privateToAddress(privateKey: string): string {
        return this.privateToPublic(privateKey);
    }

    public getAccountFromPrivateKey(privateKey: string, index: number): IAccountState {
        const keyPair = nacl.sign.keyPair.fromSecretKey(bs58.decode(privateKey));
        const pk = bs58.encode(Buffer.from(keyPair.publicKey));
        const address = Buffer.from(bs58.decode(pk)).toString('hex');

        return {
            index: 0,
            type: AccountType.DEFAULT,
            selected: false,
            publicKey: 'ed25519:' + pk,
            address,
            blockchain: Blockchain.NEAR,
            tokens: generateTokensConfig(Blockchain.NEAR)
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

    public getLockupContract(accountId: string, chainId: string): string {
        return sha256(Buffer.from(accountId)).substring(0, 40) + NEAR_LOCKUP_SUFFIX[chainId];
    }
}
