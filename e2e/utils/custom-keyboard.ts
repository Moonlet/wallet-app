/**
 * Tap on element by id
 * @param key
 * - we need try catch because our custom keyboard crashes sometimes
 */
export const tapElementById = async (key: string) => {
    try {
        await element(by.id(key)).tap();
    } catch {
        //
    }
};

/**
 * Type a word
 * - by using element tap of each letter
 * - when finished focus the next word // maybe this should be optional
 * @param word
 */
export const typeWord = async (word: string) => {
    const arr = word.split('');

    for (const w of arr) {
        await tapElementById(`key-${w}`);
    }

    // Focus next input
    await tapNextWordButton();
};

/**
 * Type mnemonic
 * @param mnemonic
 */
export const typeMnemonic = async (mnemonic: string) => {
    const arr = mnemonic.split(' ');

    for (const m of arr) {
        await typeWord(m);
    }
};

/**
 * Tap on the <Button /> with id next-word
 */
export const tapNextWordButton = async () => tapElementById('next-word');

/**
 * Tap on the <Button /> with id confirm
 */
export const tapConfirmButton = async () => tapElementById('confirm');
