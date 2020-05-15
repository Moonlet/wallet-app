import { NativeModules } from 'react-native';
import { SALT, HASH_COST, HASH_LENGTH, SEPARATOR, IV_LENGTH } from './consts';

const Aes = NativeModules.Aes;

export const hash = async (text: string, salt: string = SALT): Promise<string> =>
    Aes.pbkdf2(text, salt, HASH_COST, HASH_LENGTH);

export const generateRandomEncryptionKey = async (): Promise<string> => {
    const randomKey = await Aes.randomKey(IV_LENGTH);
    return Aes.pbkdf2(randomKey, SALT, HASH_COST, HASH_LENGTH);
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
