import * as utils from '../utils/utils';
import * as customKeyboard from '../utils/custom-keyboard';

const mnemonicSteps = async () => {
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

const mnemonicConfirm = async () => {
    // Focus first input
    await customKeyboard.nextWordTap();

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
    await customKeyboard.confirmTap();
};

describe('Create Wallet', () => {
    beforeEach(async () => {
        // await device.reloadReactNative(); // use only if needed
    });

    it('Fresh install', async () => {
        // Onboarding Screen
        await utils.expectElementVisible('onboarding-screen');

        // Create Button
        await utils.expectElementVisible('create-button');
        await utils.elementByIdTap('create-button');

        // Legal
        await utils.expectElementVisible('legal-modal');
        await utils.expectElementVisible('legal-accept-button');
        await utils.elementByIdTap('legal-accept-button');

        // Create Wallet Mnemonic Screen
        await mnemonicSteps();

        // Create Wallet Confirm Mnemonic Screen
        await utils.expectElementVisible('create-wallet-confirm-mnemonic');
        await mnemonicConfirm();

        // Password Terms Screen
        await utils.expectElementVisible('password-terms-screen');
        await utils.elementByIdTap('pass-terms-checkbox');
        await utils.elementByIdTap('understand-button');

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('123456'); // set pin code
        await customKeyboard.typeWord('123456'); // verify pin code

        // Dashboard Screen
        await utils.expectElementVisible('dashboard-screen');
    });

    it('Create another wallet', async () => {
        await device.reloadReactNative();

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('123456'); // enter pin code

        // Dashboard Screen
        await utils.expectElementVisible('dashboard-screen');
        await utils.elementByIdTap('wallets-icon');

        // Wallets Screen
        await utils.expectElementVisible('wallets-screen');
        await utils.elementByIdTap('create-button');

        // Create Wallet Mnemonic Screen
        await mnemonicSteps();

        // Create Wallet Confirm Mnemonic Screen
        await utils.expectElementVisible('create-wallet-confirm-mnemonic');
        await mnemonicConfirm();

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('123456'); // enter pin code

        // Dashboard Screen
        await utils.expectElementVisible('dashboard-screen');
    });
});
