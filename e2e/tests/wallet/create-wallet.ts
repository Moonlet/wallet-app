import * as utils from '../../utils/utils';
import * as customKeyboard from '../../utils/custom-keyboard';
import { mnemonicSteps, mnemonicConfirm } from './common';

/**
 * Create Wallet- Fresh Install
 */
export const createWalletFreshInstall = async () => {
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
};

/**
 * Create another wallet
 */
export const createAnotherWallet = async () => {
    await utils.realoadRNAndEnterPin('123456');

    // Dashboard Screen
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
};
