import { generateMnemonic, validateMnemonic, wordlists, mnemonicToSeedSync } from 'bip39';

export class Mnemonic {
    public static generate(words: 12 | 24 = 24): string {
        const strength = words === 24 ? 256 : 128;
        return generateMnemonic(strength, undefined, wordlists.EN);
    }

    public static verify(mnemonic: string): boolean {
        return validateMnemonic(mnemonic, wordlists.EN);
    }

    public static toSeed(mnemonic: string): Buffer {
        return mnemonicToSeedSync(mnemonic);
    }
}
