import * as utils from '../utils/utils';

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
