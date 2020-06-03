import { getProps } from 'detox-getprops';

export const elementTap = async (key: string) => element(by.id(key)).tap();

export const elementVisible = async (key: string) =>
    (expect(element(by.id(key))) as any).toBeVisible();

export const typeWord = async (word: string) => {
    for (let i = 0; i < word.length; i++) {
        try {
            await elementTap(`key-${word.charAt(i)}`);
        } catch {
            //
        }
    }

    // Focus next input
    await nextWordTap();
};

export const typeMnemonic = async (mnemonic: string) => {
    const arr = mnemonic.split(' ');

    for (let i = 0; i < arr.length; i++) {
        await typeWord(arr[i]);
    }
};

export const nextWordTap = async () => elementTap('next-word');

export const confirmTap = async () => elementTap('confirm');

export const getText = async (key: string) => ((await getProps(element(by.id(key)))) as any).text;
