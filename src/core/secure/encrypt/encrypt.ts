import { NativeModules } from 'react-native';
import { SALT, HASH_COST, HASH_LENGTH, SEPARATOR, ITERATIONS, IV_LENGTH } from './consts';
import { captureException } from '@sentry/react-native';
import pbkdf2 from 'crypto-js/pbkdf2';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
const Aes = NativeModules.Aes;

export const hash = async (text: string, salt: string = SALT): Promise<string> =>
    Aes.pbkdf2(text, salt, HASH_COST, HASH_LENGTH);

export const generateRandomEncryptionKey = async (): Promise<string> => {
    try {
        const randomKey = await Aes.randomKey(IV_LENGTH);
        const encryptionKey = await Aes.pbkdf2(randomKey, SALT, HASH_COST, HASH_LENGTH);

        if (encryptionKey) {
            return encryptionKey;
        } else {
            throw new Error(
                'generateRandomEncryptionKey: generated encryption key evaluates to falsy. (fallback to js implementation to avoid crash)'
            );
        }
    } catch (err) {
        captureException(err);

        return pbkdf2(
            uuidv4(),
            SALT,
            { keySize: 512 / 32, iterations: ITERATIONS },
            HASH_LENGTH
        ).toString(CryptoJS.enc.Base64);
    }
};

// aes encrypt
export const encrypt = async (data: string, key: string): Promise<string> => {
    return Aes.randomKey(IV_LENGTH).then((iv: string) =>
        Aes.encrypt(data, key, iv).then((cipher: string) => `${iv}${SEPARATOR}${cipher}`)
    );
};

// aes decrypt
export const decrypt = async (input: string, key: string): Promise<string> => {
    const [iv, encryptedData] = input.split(SEPARATOR);
    return Aes.decrypt(encryptedData, key, iv);
};
