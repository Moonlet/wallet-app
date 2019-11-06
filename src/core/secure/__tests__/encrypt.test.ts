import { hash, encrypt, decrypt } from '../encrypt';

describe('encrypt', () => {
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
