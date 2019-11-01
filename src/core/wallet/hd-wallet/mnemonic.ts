import { validateMnemonic, wordlists, mnemonicToSeedSync, entropyToMnemonic } from 'bip39';
import { NativeModules } from 'react-native';

const getRandomBytes: any = (n: number) => {
    return new Promise((resolve, reject) => {
        NativeModules.RNRandomBytes.randomBytes(n, (err: any, base64Bytes: string) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(new Buffer(base64Bytes, 'base64'));
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
