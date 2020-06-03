import {
    typeWord,
    nextWordTap,
    confirmTap,
    getText,
    elementTap,
    elementVisible
} from '../utils/utils';

describe('Create Wallet', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('Create Flow', async () => {
        await elementVisible('onboarding-screen');

        // Create Button
        await elementVisible('create-button');
        await element(by.id('create-button')).tap();

        // Legal
        await elementVisible('legal-modal');
        await elementVisible('legal-accept-button');
        await element(by.id('legal-accept-button')).tap();

        // Create Wallet Mnemonic Screen

        // Step 1
        await elementVisible('create-wallet-mnemonic-1');

        await elementTap('checkbox');
        await elementTap('next-button-1');

        // Step 2
        await elementVisible('create-wallet-mnemonic-2');
        await elementTap('next-button-2');

        // Step 3
        await elementVisible('create-wallet-mnemonic-3');
        await elementTap('next-button-3');

        // Create Wallet Confirm Mnemonic Screen
        await elementVisible('create-wallet-confirm-mnemonic');

        // Focus first input
        await nextWordTap();

        // Mnmonic Word 1
        await elementVisible('mnemonic-0');
        await typeWord(await getText('mnemonic-0'));

        // Mnmonic Word 2
        await elementVisible('mnemonic-1');
        await typeWord(await getText('mnemonic-1'));

        // Mnmonic Word 3
        await elementVisible('mnemonic-2');
        await typeWord(await getText('mnemonic-2'));

        // Confirm
        await confirmTap();

        // Password Terms Screen
        await elementVisible('password-terms-screen');
        await elementTap('pass-terms-checkbox');
        await elementTap('understand-button');

        // Password Pin Screen
        await elementVisible('password-pin-screen');
        await typeWord('123456'); // set pin code
        await typeWord('123456'); // verify pin code

        await elementVisible('dashboard-screen');
    });
});
