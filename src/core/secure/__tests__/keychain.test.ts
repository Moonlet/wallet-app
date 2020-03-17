import { setPassword, getPassword } from '../keychain';

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
        await setPassword('some password');
        expect(await getPassword()).toBe('hashedkey');
    });
});
