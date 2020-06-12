import * as utils from '../../utils/utils';
import { sendToken, addToken } from './utils';
import { XSGD_TESTNET_CONTRACT_ADDRESS } from '../../utils/config';

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
            await addToken(XSGD_TESTNET_CONTRACT_ADDRESS);

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
