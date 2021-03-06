import * as utils from '../../../utils/detox-utils';
import { sendToken } from '../utils';
import { DAI_TESTNET_CONTRACT_ADDRESS } from '../../../utils/values';
import { addToken } from '../../common/functions';

export const sendEthTest = () => {
    describe('Send Ethereum', () => {
        /**
         * ETH Native
         * - testnet
         */
        it('Send ETH Native', async () => {
            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.tapElementByLabel('ETH');
            await utils.tapElementById('token-card-eth');

            // Default Token Screen
            await utils.expectElementVisible('default-token-screen');
            await utils.tapElementById('send-button');

            // Send
            await sendToken('0.001');

            // Default Token Screen
            await utils.expectElementVisible('default-token-screen');
            await utils.expectElementVisible('transaction-0');
        });

        /**
         * ETH ERC2
         * - DAI token
         * - testnet
         */
        it('Send ERC2 - DAI token', async () => {
            await utils.realoadRNAndEnterPin(utils.PIN_CODE_GENERATE_WALLET);

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();

            // Add DAI - testnet
            await addToken(DAI_TESTNET_CONTRACT_ADDRESS);

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.tapElementById('token-card-dai');

            // Default Token Screen
            await utils.expectElementVisible('default-token-screen');
            await utils.tapElementById('send-button');

            // Send
            await sendToken('0.001');

            // Default Token Screen
            await utils.expectElementVisible('default-token-screen');
            await utils.expectElementVisible('transaction-0');
        });
    });
};
