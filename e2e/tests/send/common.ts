import * as utils from '../../utils/utils';
import * as customKeyboard from '../../utils/custom-keyboard';

/**
 * Generate Wallet
 */
export const generateWallet = async () => {
    // Onboarding Screen
    await utils.expectElementVisible('onboarding-screen');
    await utils.elementByIdTap('generate-button');

    // Legal
    await utils.expectElementVisible('legal-modal');
    await utils.expectElementVisible('legal-accept-button');
    await utils.elementByIdTap('legal-accept-button');

    // Dashboard Screen
    await utils.expectElementVisible('dashboard-screen');
};

/**
 * Activate Test Net
 */
export const activateTestNet = async () => {
    await utils.elementByLabelTap('Settings');

    // Settings Screen
    await utils.elementByIdTap('Mainnet/Testnet');

    // Network Options Screen
    await utils.elementByIdTap('toggle-testnet');

    // Go back => Settings Screen
    await utils.goBack();

    // Dashboard Screen
    await utils.elementByLabelTap('Dashboard');

    await utils.expectElementVisible('testnet-badge');
};

/**
 * Add Token
 * @param contractAddress
 */
export const addToken = async (contractAddress: string) => {
    await utils.elementByIdTap('dashboard-menu-icon');

    // Manage Account Screen
    await utils.elementByIdTap('manage-account');
    await utils.elementByIdTap('add-icon');

    // Manage Token Screen
    await utils.elementTypeText('search-input', contractAddress);
    await utils.elementByLabelTap('Find');
    await utils.elementByIdTap('found-token');
    await utils.elementByLabelTap('Save');

    await utils.goBack();
};

/**
 * Send Token
 * @param amount
 */
export const sendToken = async (amount: string) => {
    // Send Screen

    // Select address
    await utils.elementByIdTap('transfer-between-accounts');
    await utils.elementByIdTap('account-2');
    await utils.elementByIdTap('next');

    // Enter amount
    await utils.elementTypeText('enter-amount', amount);
    await utils.elementByIdTap('next');

    // Confirm Transaction
    await utils.elementByIdTap('confirm');

    // Password Pin Screen
    await utils.expectElementVisible('password-pin-screen');
    await customKeyboard.typeWord('000000'); // enter pin code
};
