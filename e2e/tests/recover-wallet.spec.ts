import * as utils from '../utils/utils';
import * as customKeyboard from '../utils/custom-keyboard';

describe('Recover Wallet', () => {
    beforeEach(async () => {
        // await device.reloadReactNative(); // use only if needed
    });

    it('Fresh install', async () => {
        // Onboarding Screen
        await utils.expectElementVisible('onboarding-screen');

        // Recover Button
        await utils.expectElementVisible('recover-button');
        await utils.elementTap('recover-button');

        // Legal
        await utils.expectElementVisible('legal-modal');
        await utils.expectElementVisible('legal-accept-button');
        await utils.elementTap('legal-accept-button');

        // Recover Screen
        await utils.expectElementVisible('recover-wallet-screen');

        // Focus first word
        await customKeyboard.nextWordTap();

        // TODO: store it as secret - decide later on
        const mnemonic12 =
            'author tumble model pretty exile little shoulder frost bridge mistake devote mixed';

        await customKeyboard.typeMnemonic(mnemonic12);

        // Confirm
        await customKeyboard.confirmTap();

        // Password Terms Screen
        await utils.expectElementVisible('password-terms-screen');
        await utils.elementTap('pass-terms-checkbox');
        await utils.elementTap('understand-button');

        // Password Pin Screen
        await utils.expectElementVisible('password-pin-screen');
        await customKeyboard.typeWord('112266'); // set pin code
        await customKeyboard.typeWord('112266'); // verify pin code

        await utils.expectElementVisible('dashboard-screen');
    });
});
