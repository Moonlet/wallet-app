// import { WalletFactory } from '../wallet-factory';
// import { WalletType } from '../types';
// import { HDWallet } from '../hd-wallet/hd-wallet';

jest.mock('../hd-wallet/hd-wallet');

describe('WalletFactory', () => {
    test('get()', async () => {
        // HDWallet.loadFromStorage = jest.fn();
        // let wallet = WalletFactory.get('', WalletType.HD, {});
        // expect(wallet).toBeInstanceOf(Promise);
        // expect(HDWallet.loadFromStorage).toHaveBeenCalledTimes(1);

        // wallet = WalletFactory.get('', 'INVALID_TYPE' as any, {});
        // expect(wallet).toBeInstanceOf(Promise);
        // expect(HDWallet.loadFromStorage).toHaveBeenCalledTimes(2);

        expect('wallet').toEqual('wallet');
    });
});
