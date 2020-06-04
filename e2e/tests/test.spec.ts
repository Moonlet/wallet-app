import * as utils from '../utils/utils';
import * as customKeyboard from '../utils/custom-keyboard';
import { generateWallet, activateTestNet } from './common';

describe('Tests', () => {
    it('Generate wallet and activate testnet', async () => {
        // Generate wallet
        await generateWallet();

        await activateTestNet();
    });

    describe('Send ETH', () => {
        it('Native', async () => {
            // Dashboard Screen
            await utils.expectElementVisible('dashboard-screen');
            await utils.elementByLabelTap('ETH');
            await utils.elementByIdTap('token-card-eth');

            // Default Token Screen
            await utils.expectElementVisible('default-token-screen');
            await utils.elementByIdTap('send-button');

            /// === Send Screen === ///

            // Select address
            await utils.elementByIdTap('transfer-between-accounts');
            await utils.elementByIdTap('account-2');
            await utils.elementByIdTap('next');

            // Enter amount
            await utils.elementTypeText('enter-amount', '0.001');
            await utils.elementByIdTap('next');

            // Confirm Transaction
            await utils.elementByIdTap('confirm');

            // Password Pin Screen
            await utils.expectElementVisible('password-pin-screen');
            await customKeyboard.typeWord('000000'); // enter pin code

            // Default Token Screen
            await utils.expectElementVisible('default-token-screen');
        });
    });
});
