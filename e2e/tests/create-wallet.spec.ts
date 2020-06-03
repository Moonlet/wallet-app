import * as utils from '../utils/utils';
import * as customKeyboard from '../utils/custom-keyboard';

describe('Create Wallet', () => {
    beforeEach(async () => {
        // await device.reloadReactNative(); // use only if needed
    });

    it('Fresh install', async () => {
        // Onboarding Screen
        await utils.expectElementVisible('onboarding-screen');

        // Create Button
        await utils.expectElementVisible('create-button');
        await utils.elementTap('create-button');

        // Legal
        await utils.expectElementVisible('legal-modal');
        await utils.expectElementVisible('legal-accept-button');
        await utils.elementTap('legal-accept-button');

        // Create Wallet Mnemonic Screen

        // Step 1
        await utils.expectElementVisible('create-wallet-mnemonic-1');

        await utils.elementTap('checkbox');
        await utils.elementTap('next-button-1');

        // Step 2
        await utils.expectElementVisible('create-wallet-mnemonic-2');
        await utils.elementTap('next-button-2');

        // Step 3
        await utils.expectElementVisible('create-wallet-mnemonic-3');
        await utils.elementTap('next-button-3');

        // Create Wallet Confirm Mnemonic Screen
        await utils.expectElementVisible('create-wallet-confirm-mnemonic');

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

        // Password Terms Screen
        await utils.expectElementVisible('password-terms-screen');
        await utils.elementTap('pass-terms-checkbox');
        await utils.elementTap('understand-button');

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('123456'); // set pin code
        await customKeyboard.typeWord('123456'); // verify pin code

        await utils.expectElementVisible('dashboard-screen');
    });
});
