import * as utils from '../../../utils/detox-utils';
import { deleteTokenManageScreen } from '../utils';
import { activateTestNetTest } from '../../common/tests';
import { addToken } from '../../common/functions';
import { DAI_TESTNET_CONTRACT_ADDRESS } from '../../../utils/values';

/**
 * ERC20 Tokens Management
 */
export const erc20TokensManagementTest = () => {
    describe('ERC20', () => {
        /**
         * DAI Mainnet
         */
        it('DAI Token - Mainnet', async () => {
            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.tapElementByLabel('ETH');
            await utils.expectElementVisible('token-card-dai');
        });

        /**
         * Delete DAI Token - Mainnet
         */
        it('Delete DAI Token - Mainnet', async () => {
            // Dashboard Screen
            await utils.tapElementById('dashboard-menu-icon');

            // Manage Account Screen
            await deleteTokenManageScreen('DAI');
        });

        /**
         * Activate TestNet
         */
        activateTestNetTest();

        /**
         * Add DAI Token - Testnet
         */
        it('Add DAI Token - Testnet', async () => {
            await utils.expectElementNotVisible('token-card-dai');

            // Add DAI - testnet
            await addToken(DAI_TESTNET_CONTRACT_ADDRESS);

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.expectElementVisible('token-card-dai');
        });

        /**
         * Add LINK Token - Testnet
         */
        it('Add LINK Token - Testnet', async () => {
            await utils.expectElementNotVisible('token-card-link');

            // Add LINK - testnet
            await addToken('link');

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.expectElementVisible('token-card-link');
        });

        /**
         * Delete DAI Token - Testnet
         */
        it('Delete DAI Token - Testnet', async () => {
            // Dashboard Screen
            await utils.tapElementById('dashboard-menu-icon');

            // Manage Account Screen
            await deleteTokenManageScreen('DAI');
        });
    });
};
