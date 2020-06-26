import * as utils from '../../utils/detox-utils';

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
 * Activate Main Net
 */
export const activateMainNetTest = () => {
    describe('Activate Main Net', () => {
        it('activate mainnet', async () => {
            await utils.tapElementByLabel('Settings');

            // Settings Screen
            await utils.tapElementById('Mainnet/Testnet');

            // Network Options Screen
            await utils.tapElementById('toggle-testnet');

            // Go back => Settings Screen
            await utils.tapBackButton();

            // Dashboard Screen
            await utils.tapElementByLabel('Dashboard');

            await utils.expectElementNotVisible('testnet-badge');
        });
    });
};
