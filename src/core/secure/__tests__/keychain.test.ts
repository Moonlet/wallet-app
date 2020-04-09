import { getPassword, setPinCode } from '../keychain';
import { hash } from '../encrypt';

jest.mock('@react-native-community/async-storage', () => ({
    setItem: jest.fn(() => {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }),

    getItem: jest.fn(() => {
        return new Promise((resolve, reject) => {
            resolve(JSON.stringify(''));
        });
    })
}));

describe('keychain', () => {
    test('set password', async () => {
        const keychainPassword = await getPassword();
        expect(keychainPassword.password).toBe(await hash('000000'));
    });
});
