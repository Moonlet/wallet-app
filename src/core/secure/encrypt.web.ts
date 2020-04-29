import AES from 'crypto-js/aes';

// const SALT = 'moonlet-app';
// const HASH_LENGTH = 256;
// const HASH_COST = 5000;
const IV_LENGTH = 16;
const SEPARATOR = '!';

// export const hash = async (text: string, salt: string = SALT) =>
//     Aes.pbkdf2(text, salt, HASH_COST, HASH_LENGTH);

// export const generateRandomEncryptionKey = async () => {
//     const randomKey = await Aes.randomKey(IV_LENGTH);
//     return Aes.pbkdf2(randomKey, SALT, HASH_COST, HASH_LENGTH);
// };

// TODO
// AES Encrypt
export const encrypt = (data: string, key: string) => AES.encrypt(data, key, { IV_LENGTH });

// AES Decrypt
export const decrypt = (input: string, key: string) => {
    const [iv, encryptedData] = input.split(SEPARATOR);
    return AES.decrypt(encryptedData, key, { iv });
};
