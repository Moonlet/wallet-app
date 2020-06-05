import * as utils from '../../utils/utils';
import * as customKeyboard from '../../utils/custom-keyboard';

export const mnemonicSteps = async () => {
    // Step 1
    await utils.expectElementVisible('create-wallet-mnemonic-1');

    await utils.elementByIdTap('checkbox');
    await utils.elementByIdTap('next-button-1');

    // Step 2
    await utils.expectElementVisible('create-wallet-mnemonic-2');
    await utils.elementByIdTap('next-button-2');

    // Step 3
    await utils.expectElementVisible('create-wallet-mnemonic-3');
    await utils.elementByIdTap('next-button-3');
};

export const mnemonicConfirm = async () => {
    // Focus first input
    await customKeyboard.nextWordButtonTap();

    // Mnmonic Word 1
    await utils.expectElementVisible('mnemonic-0');
    await customKeyboard.typeWord(await utils.getText('mnemonic-0'));

    // Mnmonic Word 2
    await utils.expectElementVisible('mnemonic-1');
    await customKeyboard.typeWord(await utils.getText('mnemonic-1'));

    // Mnmonic Word 3
    await utils.expectElementVisible('mnemonic-2');
    await customKeyboard.typeWord(await utils.getText('mnemonic-2'));

    // Confirm
    await customKeyboard.confirmButtonTap();
};

export const enterMnemonic = async () => {
    // Focus first word
    await customKeyboard.nextWordButtonTap();

    // TODO: store it as secret - decide later on
    const mnemonic12 =
        'author tumble model pretty exile little shoulder frost bridge mistake devote mixed';

    await customKeyboard.typeMnemonic(mnemonic12);

    // Confirm
    await customKeyboard.confirmButtonTap();
};
