import { WalletFactory } from '../wallet-factory';
import { WalletType } from '../types';
import { HDWallet } from '../hd-wallet/hd-wallet';

describe('WalletFactory', () => {
    test('get()', async () => {
        let wallet = WalletFactory.get('', WalletType.HD);
        expect(wallet).toBeInstanceOf(Promise);
        expect(await wallet).toBeInstanceOf(HDWallet);

        wallet = WalletFactory.get('', 'INVALID_TYPE' as any);
        expect(wallet).toBeInstanceOf(Promise);
        expect(await wallet).toBeInstanceOf(HDWallet);
    });
});
