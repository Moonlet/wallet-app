import * as utils from '../../../utils/detox-utils';
import { deleteTokenManageScreen } from '../utils';
import { activateTestNetTest } from '../../common/tests';
import { addToken } from '../../common/functions';
import { XSGD_TESTNET_CONTRACT_ADDRESS } from '../../../utils/values';

/**
 * ZRC2 Tokens Management
 */
export const zrc2TokensManagementTest = () => {
    describe('ZRC2', () => {
        /**
         * XSGD Mainnet
         */
        it('XSGD Token - Mainnet', async () => {
            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.expectElementVisible('token-card-xsgd');
        });

        /**
         * Delete XSGD Token - Mainnet
         */
        it('Delete XSGD Token - Mainnet', async () => {
            // Dashboard Screen
            await utils.tapElementById('dashboard-menu-icon');

            // Manage Account Screen
            await deleteTokenManageScreen('XSGD');
        });

        /**
         * Activate TestNet
         */
        activateTestNetTest();

        /**
         * Add XSGD Token - Testnet
         */
        it('Add XSGD Token - Testnet', async () => {
            await utils.expectElementNotVisible('token-card-xsgd');

            // Add XSGD - testnet
            await addToken(XSGD_TESTNET_CONTRACT_ADDRESS);

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.expectElementVisible('token-card-xsgd');
        });

        /**
         * Delete XSGD Token - Testnet
         */
        it('Delete XSGD Token - Testnet', async () => {
            // Dashboard Screen
            await utils.tapElementById('dashboard-menu-icon');

            // Manage Account Screen
            await deleteTokenManageScreen('XSGD');
        });
    });
};
