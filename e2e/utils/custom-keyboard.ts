export const elementTap = async (key: string) => {
    try {
        await element(by.id(key)).tap();
    } catch {
        //
    }
};

export const typeWord = async (word: string) => {
    const arr = word.split('');

    for (const w of arr) {
        await elementTap(`key-${w}`);
    }

    // Focus next input
    await nextWordTap();
};

export const typeMnemonic = async (mnemonic: string) => {
    const arr = mnemonic.split(' ');

    for (const m of arr) {
        await typeWord(m);
    }
};

export const nextWordTap = async () => elementTap('next-word');

export const confirmTap = async () => elementTap('confirm');
