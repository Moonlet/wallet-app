import { EthereumAccountUtils } from '../ethereum/account';
import { AccountType, IAccountState } from '../../../redux/wallets/state';
import { Blockchain } from '../types';
import { generateTokensConfig } from '../../../redux/tokens/static-selectors';

export class CeloAccountUtils extends EthereumAccountUtils {
    public getAccountFromPrivateKey(privateKey: string, index: number): IAccountState {
        return {
            index,
            type: AccountType.DEFAULT,
            selected: false,
            publicKey: this.privateToPublic(privateKey),
            address: this.privateToAddress(privateKey),
            blockchain: Blockchain.CELO,
            tokens: generateTokensConfig(Blockchain.CELO)
        };
    }
}
