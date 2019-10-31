import { validateMnemonic, wordlists, mnemonicToSeedSync, entropyToMnemonic } from 'bip39';
// @ts-ignore
import { randomBytes } from 'react-native-randombytes';

const getRandomBytes: any = (n: number) => {
    return new Promise((resolve, reject) => {
        randomBytes(n, (err: any, bytes: Buffer) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(bytes);
        });
    });
};

export class Mnemonic {
    public static async generate(words: 12 | 24 = 24): Promise<string> {
        const randomBytesNr = words === 24 ? 32 : 16;

        try {
            const bytes = await getRandomBytes(randomBytesNr);
            const mnemonic = entropyToMnemonic(bytes, wordlists.EN);
            return mnemonic;
        } catch (e) {
            throw new Error(e);
        }
    }

    public static verify(mnemonic: string): boolean {
        return validateMnemonic(mnemonic, wordlists.EN);
    }

    public static toSeed(mnemonic: string): Buffer {
        return mnemonicToSeedSync(mnemonic);
    }
}
