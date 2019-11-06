import { hash, encrypt, decrypt } from '../encrypt';

// jest.mock('../../../blockchain/blockchain-factory');
// jest.mock('../mnemonic');
// jest.mock('hdkey', () => {
//     return {
//         __esModule: true,
//         default: () => ({
//             derive: jest.fn()
//         })
//     };
// });

describe('encrypt', () => {
    // Mnemonic.verify = jest.fn().mockReturnValue(true);
    // Mnemonic.toSeed = jest.fn().mockReturnValue('MASTER_SEED');
    // HDKey.fromMasterSeed = jest.fn();

    test('generate hash', async () => {
        expect(await hash('some password')).toBe('hashedkey');
    });
    test('encrypt', async () => {
        expect(await encrypt('data', 'hash')).toBe('randomKey!encrypted');
    });
    test('decrypt', async () => {
        expect(await decrypt('randomKey!encrypted', 'hash')).toBe('data');
    });
});
