import {
    nextWordTap,
    confirmTap,
    elementTap,
    elementVisible,
    typeMnemonic,
    typeWord
} from '../utils/utils';

describe('Recover Wallet', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('Recover Flow', async () => {
        await elementVisible('onboarding-screen');

        // Recover Button
        await elementVisible('recover-button');
        await elementTap('recover-button');

        // Legal
        await elementVisible('legal-modal');
        await elementVisible('legal-accept-button');
        await elementTap('legal-accept-button');

        // Recover Screen
        await elementVisible('recover-wallet-screen');

        // Focus first word
        await nextWordTap();

        // TODO: store it as secret
        const mnemonic12 =
            'author tumble model pretty exile little shoulder frost bridge mistake devote mixed';

        await typeMnemonic(mnemonic12);

        // Confirm
        await confirmTap();

        // Password Terms Screen
        await elementVisible('password-terms-screen');
        await elementTap('pass-terms-checkbox');
        await elementTap('understand-button');

        // Password Pin Screen
        await elementVisible('password-pin-screen');
        await typeWord('112266'); // set pin code
        await typeWord('112266'); // verify pin code

        await elementVisible('dashboard-screen');
    });
});
