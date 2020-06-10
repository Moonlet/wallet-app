import * as utils from '../../utils/utils';
import * as customKeyboard from '../../utils/custom-keyboard';
import { mnemonicSteps, mnemonicConfirm } from './utils';

describe('Create Wallet', () => {
    /**
     * Create Wallet- Fresh Install
     */
    it('Fresh install', async () => {
        // Onboarding Screen
        await utils.expectElementVisible('onboarding-screen');

        // Create Button
        await utils.expectElementVisible('create-button');
        await utils.tapElementById('create-button');

        // Legal
        await utils.expectElementVisible('legal-modal');
        await utils.expectElementVisible('legal-accept-button');
        await utils.tapElementById('legal-accept-button');

        // Create Wallet Mnemonic Screen
        await mnemonicSteps();

        // Create Wallet Confirm Mnemonic Screen
        await utils.expectElementVisible('create-wallet-confirm-mnemonic');
        await mnemonicConfirm();

        // Password Terms Screen
        await utils.expectElementVisible('password-terms-screen');
        await utils.tapElementById('pass-terms-checkbox');
        await utils.tapElementById('understand-button');

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('123456'); // set pin code
        await customKeyboard.typeWord('123456'); // verify pin code

        // Dashboard Screen
        await utils.expectDashboardScreenVisible();
    });

    /**
     * Create another wallet
     */
    it('Create another wallet', async () => {
        await utils.realoadRNAndEnterPin('123456');

        // Dashboard Screen
        await utils.expectDashboardScreenVisible();
        await utils.tapElementById('wallets-icon');

        // Wallets Screen
        await utils.expectElementVisible('wallets-screen');
        await utils.tapElementById('create-button');

        // Create Wallet Mnemonic Screen
        await mnemonicSteps();

        // Create Wallet Confirm Mnemonic Screen
        await utils.expectElementVisible('create-wallet-confirm-mnemonic');
        await mnemonicConfirm();

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('123456'); // enter pin code

        // Dashboard Screen
        await utils.expectDashboardScreenVisible();
    });
});
