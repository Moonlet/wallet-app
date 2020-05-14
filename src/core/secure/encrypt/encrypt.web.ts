import AES from 'crypto-js/aes';
import pbkdf2 from 'crypto-js/pbkdf2';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { SALT, HASH_COST, HASH_LENGTH, ITERATIONS, IV_LENGTH } from './types';

export const hash = async (text: string, salt: string = SALT): Promise<string> => {
    return pbkdf2(text, salt, HASH_COST, HASH_LENGTH).toString(CryptoJS.enc.Utf8);
};

export const generateRandomEncryptionKey = async (): Promise<string> => {
    return pbkdf2(
        uuidv4(),
        SALT,
        { keySize: 512 / 32, iterations: ITERATIONS },
        HASH_LENGTH
    ).toString(CryptoJS.enc.Base64);
};

// AES Encrypt
export const encrypt = async (data: string, key: string): Promise<string> => {
    return AES.encrypt(data, key, { IV_LENGTH }).toString();
};

// AES Decrypt
export const decrypt = async (input: string, key: string): Promise<string> => {
    return AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
};
