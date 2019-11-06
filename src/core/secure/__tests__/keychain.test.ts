import { setPassword, getPassword } from '../keychain';

describe('keychain', () => {
    test('set password', async () => {
        await setPassword('some password');
        expect(await getPassword()).toBe('hashedkey');
    });
});
