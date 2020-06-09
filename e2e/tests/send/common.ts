import * as utils from '../../utils/utils';
import * as customKeyboard from '../../utils/custom-keyboard';

/**
 * Generate Wallet
 */
export const generateWalletTest = () => {
    describe('Generate wallet ', () => {
        it('generate', async () => {
            // Onboarding Screen
            await utils.expectElementVisible('onboarding-screen');
            await utils.tapElementById('generate-button');

            // Legal
            await utils.expectElementVisible('legal-modal');
            await utils.expectElementVisible('legal-accept-button');
            await utils.tapElementById('legal-accept-button');

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
        });
    });
};

/**
 * Activate Test Net
 */
export const activateTestNetTest = () => {
    describe('Activate Test Net', () => {
        it('activate testnet', async () => {
            await utils.tapElementByLabel('Settings');

            // Settings Screen
            await utils.tapElementById('Mainnet/Testnet');

            // Network Options Screen
            await utils.tapElementById('toggle-testnet');

            // Go back => Settings Screen
            await utils.tapBackButton();

            // Dashboard Screen
            await utils.tapElementByLabel('Dashboard');

            await utils.expectElementVisible('testnet-badge');
        });
    });
};

/**
 * Add Token
 * @param contractAddress
 */
export const addToken = async (contractAddress: string) => {
    await utils.tapElementById('dashboard-menu-icon');

    // Manage Account Screen
    await utils.tapElementById('manage-account');
    await utils.tapElementById('add-icon');

    // Manage Token Screen
    await utils.typeTextElementById('search-input', contractAddress);
    await utils.tapElementByLabel('Find');
    await utils.tapElementById('found-token');
    await utils.tapElementByLabel('Save');

    await utils.tapBackButton();
};

/**
 * Send Token
 * @param amount
 */
export const sendToken = async (amount: string) => {
    // Send Screen

    // Select address
    await utils.tapElementById('transfer-between-accounts');
    await utils.tapElementById('account-2');
    await utils.tapElementById('next');

    // Enter amount
    await utils.typeTextElementById('enter-amount', amount);
    await utils.tapElementById('next');

    // Confirm Transaction
    await utils.tapElementById('confirm');

    // Password Pin Screen
    await utils.expectElementVisible('password-pin-screen');
    await customKeyboard.typeWord(utils.PIN_CODE_GENERATE_WALLET); // enter pin code
};
