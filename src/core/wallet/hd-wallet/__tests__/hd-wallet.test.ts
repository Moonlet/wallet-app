import { HDWallet } from '../hd-wallet';
import { Mnemonic } from '../mnemonic';
import HDKey from 'hdkey';
import { Blockchain } from '../../../blockchain/types';
import * as BlockchainFactory from '../../../blockchain/blockchain-factory';

// TODO organize mocks better, right now it's a mess

jest.mock('../../../blockchain/blockchain-factory');
jest.mock('../mnemonic');
jest.mock('hdkey', () => {
    return {
        __esModule: true,
        default: () => ({
            derive: jest.fn()
        })
    };
});

describe('HDWallet', () => {
    Mnemonic.verify = jest.fn().mockReturnValue(true);
    Mnemonic.toSeed = jest.fn().mockReturnValue('MASTER_SEED');
    HDKey.fromMasterSeed = jest.fn();

    test('loadFromStorage()', async () => {
        const resultPromise = HDWallet.loadFromStorage('123', '123');
        expect(resultPromise).toBeInstanceOf(Promise);

        const result = await resultPromise;
        expect(await result).toBeInstanceOf(HDWallet);
    });

    describe('constructor()', () => {
        test('valid mnemonic', () => {
            // tslint:disable-next-line:no-unused-expression
            new HDWallet('MNEMONIC');
            expect(Mnemonic.verify).toHaveBeenCalledWith('MNEMONIC');
            expect(Mnemonic.toSeed).toHaveBeenCalledWith('MNEMONIC');
            expect(HDKey.fromMasterSeed).toHaveBeenCalledWith('MASTER_SEED');
        });

        test('invalid mnemonic', () => {
            Mnemonic.verify = jest.fn().mockReturnValue(false);
            (Mnemonic.toSeed as any).mockClear();
            (HDKey.fromMasterSeed as any).mockClear();

            expect(() => new HDWallet('INVALID_MNEMONIC')).toThrowError('Invalid mnemonic.');
            expect(Mnemonic.verify).toHaveBeenCalledWith('INVALID_MNEMONIC');
            expect(Mnemonic.toSeed).not.toHaveBeenCalled();
            expect(HDKey.fromMasterSeed).not.toHaveBeenCalled();
        });
    });

    describe('getAccounts()', () => {
        Mnemonic.verify = jest.fn().mockReturnValue(true);
        // @ts-ignore
        BlockchainFactory.getBlockchain = jest.fn().mockImplementation(() => ({
            config: {
                derivationPath: 'DERIVATION_PATH'
            },
            account: {
                getAccountFromPrivateKey: jest.fn().mockImplementation((p, i) => `ACCOUNT ${i}`)
            }
        }));
        HDKey.fromMasterSeed = jest.fn().mockReturnValue({
            derive: jest.fn().mockReturnValue({
                derive: jest.fn().mockReturnValue({
                    privateKey: Buffer.from('aaa', 'hex')
                })
            })
        });
        const wallet = new HDWallet('mnemonic');

        test('invalid index', async () => {
            await expect(wallet.getAccounts(Blockchain.ETHEREUM, 'a' as any)).rejects.toEqual(
                'HDWallet.getAccounts(): index must be a positive number.'
            );

            await expect(wallet.getAccounts(Blockchain.ETHEREUM, -1)).rejects.toEqual(
                'HDWallet.getAccounts(): index must be a positive number.'
            );
        });

        test('invalid indexTo', async () => {
            await expect(wallet.getAccounts(Blockchain.ETHEREUM, 0, 'a' as any)).rejects.toEqual(
                'HDWallet.getAccounts(): indexTo must be a positive number.'
            );

            await expect(wallet.getAccounts(Blockchain.ETHEREUM, 0, -1)).rejects.toEqual(
                'HDWallet.getAccounts(): indexTo value must be greated than index value.'
            );

            await expect(wallet.getAccounts(Blockchain.ETHEREUM, 2, 1)).rejects.toEqual(
                'HDWallet.getAccounts(): indexTo value must be greated than index value.'
            );
        });

        // test('general error', async () => {
        //     await expect(
        //         generalErrorWallet.getAccounts(Blockchain.ETHEREUM, 1)
        //     ).rejects.toEqual("There was an error while generating the accounts.");
        // })

        test('should return accounts', async () => {
            await expect(wallet.getAccounts(Blockchain.ETHEREUM, 2)).resolves.toEqual([
                'ACCOUNT 2'
            ]);

            await expect(wallet.getAccounts(Blockchain.ETHEREUM, 1, 2)).resolves.toEqual([
                'ACCOUNT 1',
                'ACCOUNT 2'
            ]);
        });

        test('invalid blockchain', async () => {
            // @ts-ignore
            BlockchainFactory.getBlockchain = jest.fn().mockImplementation(() => {
                throw new Error('Blockchain implementation not found.');
            });

            await expect(wallet.getAccounts('' as any, 1)).rejects.toEqual(
                'Blockchain implementation not found.'
            );
        });
    });

    // test('sign()', () => {
    //     Mnemonic.verify = jest.fn().mockReturnValue(true);
    //     const hdWallet = new HDWallet('MNEMONIC');
    //     expect(() => (hdWallet as any).sign()).toThrowError('Method not implemented.');
    // });
});
