import { Mnemonic } from '../mnemonic';
import { wordlists } from 'bip39';

describe('Mnemonic', () => {
    describe('generateMnemonic()', () => {
        const validateMnemonic = (mnemonic: string, wordsCount: number) => {
            expect(mnemonic).toBeDefined();

            // verify words count
            const words = mnemonic.split(' ');
            expect(words.length).toBe(wordsCount);

            // chack that words are valid, and are from wordslist
            for (const word of words) {
                expect(wordlists.EN).toContain(word);
            }
        };

        test('with no params', async () => {
            validateMnemonic(await Mnemonic.generate(), 24);
        });

        test('with 12 words', async () => {
            validateMnemonic(await Mnemonic.generate(12), 12);
        });

        test('with 24 words', async() => {
            validateMnemonic(await Mnemonic.generate(24), 24);
        });
    });

    describe('verify()', () => {
        test('menmonic with 12 words', () => {
            const mnemonic =
                'deer abstract know cousin crouch cake gauge candy bicycle goose inmate chicken';
            expect(Mnemonic.verify(mnemonic)).toBe(true);
        });

        test('mnemonic with 24 words', () => {
            const mnemonic =
                'panic club above clarify orbit resist illegal feel bus remember aspect field test bubble dog trap awesome hand room rice heavy idle faint salmon';
            expect(Mnemonic.verify(mnemonic)).toBe(true);
        });

        test('invalid mnemonic', () => {
            const mnemonics = [
                'deer deer know cousin crouch cake gauge candy bicycle goose inmate chicken',
                'deer know cousin',
                'deer abstract know cousin crouch cake gauge candy bicycle goose inmate chickens',
                'deer panic club above clarify orbit resist illegal feel bus remember aspect field test bubble dog trap awesome hand room rice heavy idle faint salmon'
            ];

            for (const mnemonic of mnemonics) {
                expect(Mnemonic.verify(mnemonic)).toBe(false);
            }
        });
    });

    test('toSeed()', () => {
        const mnemonic =
            'panic club above clarify orbit resist illegal feel bus remember aspect field test bubble dog trap awesome hand room rice heavy idle faint salmon';
        const seed =
            'ff571282e286afed89941355d63af650b11357b9b1ebfafc556d941abc16de75a904e70b0db62461f902b93f167bbe8519d489922f6feb5d348d65a74cf09e28';
        expect(Mnemonic.toSeed(mnemonic).toString('hex')).toBe(seed);
    });
});
