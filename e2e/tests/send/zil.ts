import * as utils from '../../utils/utils';
import { sendToken, addToken } from './common';

export const sendZilTest = () => {
    describe('Send Zilliqa', () => {
        /**
         * ZIL Native
         * - testnet
         */
        it('Send Zilliqa Native', async () => {
            await utils.realoadRNAndEnterPin(utils.PIN_CODE_GENERATE_WALLET);

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.tapElementByLabel('ZIL');
            await utils.tapElementById('token-card-zil');

            // Delegate Token Screen
            await utils.expectElementVisible('delegate-token-screen');
            await utils.tapElementByLabel('Send');

            // Send
            await sendToken('0.001');

            // Delegate Token Screen
            await utils.expectElementVisible('delegate-token-screen');
        });

        /**
         * ZIL ZRC2
         * - XSGD token
         * - testnet
         */
        it('Send ZRC2 - XSGD token', async () => {
            await utils.realoadRNAndEnterPin(utils.PIN_CODE_GENERATE_WALLET);

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();

            // Add XSGD - testnet
            await addToken('zil1nnwugt0e5cvf2welmyq93q6p6t7zfdjzz7s05u');

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.tapElementById('token-card-xsgd');

            // Delegate Token Screen
            await utils.expectElementVisible('delegate-token-screen');
            await utils.tapElementByLabel('Send');

            // Send
            await sendToken('0.001');

            // Delegate Token Screen
            await utils.expectElementVisible('delegate-token-screen');
        });
    });
};
