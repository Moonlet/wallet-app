import { Ethereum } from '../';
import * as Util from 'ethereumjs-util';
import { Blockchain } from '../../types';

jest.mock('ethereumjs-util', () => {
    const util = jest.requireActual('ethereumjs-util');
    return {
        ...util,
        privateToPublic: jest.fn().mockReturnValue('PUBLIC_KEY'),
        privateToAddress: jest.fn().mockReturnValue('address'),
        toChecksumAddress: jest.fn().mockReturnValue('ADDRESS'),
        publicToAddress: jest.fn().mockReturnValue('address'),
        isValidChecksumAddress: jest.fn().mockReturnValue(true),
        isValidAddress: jest.fn().mockReturnValue(true)
    };
});

const clearMocks = () => {
    // @ts-ignore
    Util.privateToPublic.mockClear();
    // @ts-ignore
    Util.privateToAddress.mockClear();
    // @ts-ignore
    Util.toChecksumAddress.mockClear();
    // @ts-ignore
    Util.publicToAddress.mockClear();
    // @ts-ignore
    Util.isValidChecksumAddress.mockClear();
    // @ts-ignore
    Util.isValidAddress.mockClear();
};

describe('Ethereum account', () => {
    beforeEach(() => {
        clearMocks();
    });

    test('isValidChecksumAddress()', () => {
        expect(Ethereum.account.isValidChecksumAddress('ADDRESS')).toBe(true);
        expect(Util.isValidChecksumAddress).toBeCalledWith('ADDRESS');
    });

    test('isValidAddress()', () => {
        expect(Ethereum.account.isValidAddress('ADDRESS')).toBe(true);
        expect(Util.isValidAddress).toBeCalledWith('ADDRESS');
    });

    test('publicToAddress()', () => {
        expect(Ethereum.account.publicToAddress('PUBLIC_KEY')).toBe('ADDRESS');
        expect(Util.publicToAddress).toBeCalledWith(Buffer.from('PUBLIC_KEY', 'hex'));
        expect(Util.toChecksumAddress).toBeCalledWith('address');
    });

    test('privateToPublic()', () => {
        expect(Ethereum.account.privateToPublic('PRIVATE_KEY')).toBe('PUBLIC_KEY');
        expect(Util.privateToPublic).toBeCalledWith(Buffer.from('PRIVATE_KEY', 'hex'));
    });

    test('privateToAddress()', () => {
        expect(Ethereum.account.privateToAddress('PRIVATE_KEY')).toBe('ADDRESS');
        expect(Util.privateToAddress).toBeCalledWith(Buffer.from('PRIVATE_KEY', 'hex'));
        expect(Util.toChecksumAddress).toBeCalledWith('address');
    });

    test('getAccountFromPrivateKey()', () => {
        // valid private key
        const result = Ethereum.account.getAccountFromPrivateKey('PRIVATE_KEY', 1);
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
});
