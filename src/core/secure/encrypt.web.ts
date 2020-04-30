import AES from 'crypto-js/aes';
import pbkdf2 from 'crypto-js/pbkdf2';
import { v4 as uuidv4 } from 'uuid';

const SALT = 'moonlet-app';
const HASH_LENGTH = 256;
// const HASH_COST = 5000;
const IV_LENGTH = 16;
// const SEPARATOR = '!';
const ITERATIONS = 1000;

// TODO
export const hash = async (text: string, salt: string = SALT) => Promise.resolve('NOT_IMPLEMENTED');
// Aes.pbkdf2(text, salt, HASH_COST, HASH_LENGTH);

export const generateRandomEncryptionKey = () =>
    pbkdf2(uuidv4(), SALT, { keySize: 512 / 32, iterations: ITERATIONS }, HASH_LENGTH);

// AES Encrypt
export const encrypt = (data: string, key: string) =>
    AES.encrypt(data, key, { IV_LENGTH }).toString();

// AES Decrypt
export const decrypt = (input: string, key: string) => AES.decrypt(input, key);
