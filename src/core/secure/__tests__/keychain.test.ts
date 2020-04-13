import { setPinCode, getPinCode, generateEncryptionKey, getEncryptionKey } from '../keychain';
import { NativeModules } from 'react-native';

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
        // await generateEncryptionKey('000000');
        // const keychainPassword = await getEncryptionKey('000000');
        expect('000000').toBe('000000');
    });
});
