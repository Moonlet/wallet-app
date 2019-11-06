import { NativeModules } from 'react-native';
const Aes = NativeModules.Aes;

const SALT = 'moonlet-app';
const HASH_LENGTH = 256;
const HASH_COST = 5000;
const IV_LENGTH = 16;
const SEPARATOR = '!';

export const hash = async (text: string) => Aes.pbkdf2(text, SALT, HASH_COST, HASH_LENGTH);

// aes encrypt
export const encrypt = async (data: string, key: string) => {
    return Aes.randomKey(IV_LENGTH).then((iv: string) =>
        Aes.encrypt(data, key, iv).then((cipher: string) => `${iv}${SEPARATOR}${cipher}`)
    );
};

// aes decrypt
export const decrypt = (input: string, key: string) => {
    const [iv, encryptedData] = input.split(SEPARATOR);
    return Aes.decrypt(encryptedData, key, iv);
};
