import * as utils from '../../utils/utils';
import * as customKeyboard from '../../utils/custom-keyboard';
import { enterMnemonic } from './common';

/**
 * Recover Wallet - Fresh install
 */
export const recoverWalletFreshInstall = async () => {
    // Onboarding Screen
    await utils.expectElementVisible('onboarding-screen');

    // Recover Button
    await utils.expectElementVisible('recover-button');
    await utils.tapElementById('recover-button');

    // Legal
    await utils.expectElementVisible('legal-modal');
    await utils.expectElementVisible('legal-accept-button');
    await utils.tapElementById('legal-accept-button');

    // Recover Screen
    await utils.expectElementVisible('recover-wallet-screen');
    await enterMnemonic();

    // Password Terms Screen
    await utils.expectElementVisible('password-terms-screen');
    await utils.tapElementById('pass-terms-checkbox');
    await utils.tapElementById('understand-button');

    // Password Pin Screen
    await utils.expectElementVisible('password-pin-screen');
    await customKeyboard.typeWord('112266'); // set pin code
    await customKeyboard.typeWord('112266'); // verify pin code

    await utils.expectDashboardScreenVisible();
};

/**
 * Recover another wallet
 */
export const recoverAnotherWallet = async () => {
    await utils.realoadRNAndEnterPin('112266');

    // Dashboard Screen
    await utils.expectDashboardScreenVisible();
    await utils.tapElementById('wallets-icon');

    // Wallets Screen
    await utils.expectElementVisible('wallets-screen');
    await utils.tapElementById('recover-button');

    // Recover Screen
    await utils.expectElementVisible('recover-wallet-screen');
    await enterMnemonic();

    // Password Pin Screen
    await utils.expectElementVisible('password-pin-screen');
    await customKeyboard.typeWord('112266'); // enter pin code

    await utils.expectDashboardScreenVisible();
};
