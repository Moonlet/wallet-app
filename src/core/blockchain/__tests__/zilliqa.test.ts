import { Zilliqa } from '../zilliqa';
import { getPubKeyFromPrivateKey, getAddressFromPrivateKey } from '@zilliqa-js/crypto/dist/util'; // import like this to optimize imports
import { toBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { Blockchain } from '../types';

jest.mock('@zilliqa-js/crypto/dist/util', () => ({
    getPubKeyFromPrivateKey: jest.fn().mockReturnValue('PUBLIC_KEY'),
    getAddressFromPrivateKey: jest.fn().mockReturnValue('address')
}));

jest.mock('@zilliqa-js/crypto/dist/bech32', () => ({
    toBech32Address: jest.fn().mockReturnValue('BECH32_ADDRESS')
}));

describe('Blockchain:Ethereum', () => {
    const zil = new Zilliqa();

    test('getAccountFromPrivateKey()', () => {
        // valid private key
        const result = zil.getAccountFromPrivateKey('PRIVATE_KEY', 1);
        expect(getPubKeyFromPrivateKey).toBeCalledWith('PRIVATE_KEY');
        expect(getAddressFromPrivateKey).toBeCalledWith('PRIVATE_KEY');
        expect(toBech32Address).toBeCalledWith('address');

        expect(result).toEqual({
            index: 1,
            blockchain: Blockchain.ETHEREUM,
            address: 'BECH32_ADDRESS',
            publicKey: 'PUBLIC_KEY'
        });

        // TODO: test with invalid privatekey, without mocks
    });

    test('getBalance()', () => {
        expect(() => zil.getBalance('ADDRESS')).toThrowError('Method not implemented.');
    });

    test('sendTransaction()', () => {
        expect(() => zil.sendTransaction()).toThrowError('Method not implemented.');
    });
});
