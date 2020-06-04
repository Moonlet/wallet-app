import * as utils from '../utils/utils';
import * as customKeyboard from '../utils/custom-keyboard';

const enterMnemonic = async () => {
    // Focus first word
    await customKeyboard.nextWordTap();

    // TODO: store it as secret - decide later on
    const mnemonic12 =
        'author tumble model pretty exile little shoulder frost bridge mistake devote mixed';

    await customKeyboard.typeMnemonic(mnemonic12);

    // Confirm
    await customKeyboard.confirmTap();
};

describe('Recover Wallet', () => {
    beforeEach(async () => {
        // await device.reloadReactNative(); // use only if needed
    });

    it('Fresh install', async () => {
        // Onboarding Screen
        await utils.expectElementVisible('onboarding-screen');

        // Recover Button
        await utils.expectElementVisible('recover-button');
        await utils.elementByIdTap('recover-button');

        // Legal
        await utils.expectElementVisible('legal-modal');
        await utils.expectElementVisible('legal-accept-button');
        await utils.elementByIdTap('legal-accept-button');

        // Recover Screen
        await utils.expectElementVisible('recover-wallet-screen');
        await enterMnemonic();

        // Password Terms Screen
        await utils.expectElementVisible('password-terms-screen');
        await utils.elementByIdTap('pass-terms-checkbox');
        await utils.elementByIdTap('understand-button');

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('112266'); // set pin code
        await customKeyboard.typeWord('112266'); // verify pin code

        await utils.expectElementVisible('dashboard-screen');
    });

    it('Recover another wallet', async () => {
        await utils.realoadRNAndEnterPin('112266');

        // Dashboard Screen
        await utils.elementByIdTap('wallets-icon');

        // Wallets Screen
        await utils.expectElementVisible('wallets-screen');
        await utils.elementByIdTap('recover-button');

        // Recover Screen
        await utils.expectElementVisible('recover-wallet-screen');
        await enterMnemonic();

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('112266'); // enter pin code

        await utils.expectElementVisible('dashboard-screen');
    });
});
