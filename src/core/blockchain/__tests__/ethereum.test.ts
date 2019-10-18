import { Ethereum } from '../ethereum';
import * as Util from 'ethereumjs-util';
import { Blockchain } from '../types';

jest.mock('ethereumjs-util', () => ({
    privateToPublic: jest.fn().mockReturnValue('PUBLIC_KEY'),
    privateToAddress: jest.fn().mockReturnValue('address'),
    toChecksumAddress: jest.fn().mockReturnValue('ADDRESS')
}));

describe('Blockchain:Ethereum', () => {
    const eth = new Ethereum();

    test('getAccountFromPrivateKey()', () => {
        // valid private key
        const result = eth.getAccountFromPrivateKey('PRIVATE_KEY', 1);
        expect(Util.privateToPublic).toBeCalledWith(Buffer.from('PRIVATE_KEY', 'hex'));
        expect(Util.privateToAddress).toBeCalledWith(Buffer.from('PRIVATE_KEY', 'hex'));
        expect(Util.toChecksumAddress).toBeCalledWith('address');

        expect(result).toEqual({
            index: 1,
            blockchain: Blockchain.ETHEREUM,
            address: 'ADDRESS',
            publicKey: 'PUBLIC_KEY'
        });

        // TODO: test with invalid privatekey, without mocks
    });

    test('getBalance()', () => {
        expect(() => eth.getBalance('ADDRESS')).toThrowError('Method not implemented.');
    });

    test('sendTransaction()', () => {
        expect(() => eth.sendTransaction()).toThrowError('Method not implemented.');
    });
});
