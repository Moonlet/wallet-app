import { generateMnemonic, validateMnemonic, wordlists, mnemonicToSeedSync } from 'bip39';

export class Mnemonic {
    public static generate(words: number = 256): string {
        return generateMnemonic(words, undefined, wordlists.EN);
    }

    public static verify(mnemonic: string): boolean {
        return validateMnemonic(mnemonic, wordlists.EN);
    }

    public static toSeed(mnemonic: string): Buffer {
        return mnemonicToSeedSync(mnemonic);
    }
}
