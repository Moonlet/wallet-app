import * as utils from '../../utils/utils';
import { generateWalletTest } from '../send/common';

/**
 * Network Switch
 */

describe('Network Switch', () => {
    /**
     * Generate wallet
     */
    generateWalletTest();

    describe('', () => {
        beforeEach(async () => {
            await utils.realoadRNAndEnterPin(utils.PIN_CODE_GENERATE_WALLET);

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
        });

        it('Network switch', async () => {
            // Dashboard Screen
            // Zilliqa Mainnet active
            await utils.expectElementNotVisible('testnet-badge');
        });

        /**
         * Zilliqa Dev Testnet
         */
        it('Zilliqa Dev Testnet', async () => {
            // Network Options Screen
            await navToNetworkOptionsScreen();

            // Network Options Screen
            await utils.tapElementById('toggle-testnet');

            // Dashboard
            await navBackToDashboard();

            await utils.expectElementByLabelVisible('You are on Zilliqa Dev Testnet');
        });

        /**
         * Zilliqa Kaya Local Testnet
         */
        it('Zilliqa Kaya Local Testnet', async () => {
            // Network Options Screen
            await navToNetworkOptionsScreen();

            // Network Options Screen
            await utils.tapElementById('zilliqa');

            // Zilliqa Screen
            await utils.tapElementByLabel('Kaya Local');
            await utils.deviceGoBack('network-selection-screen'); // experimental

            // Dashboard
            await navBackToDashboard();

            await utils.expectElementByLabelVisible('You are on Zilliqa Kaya Local Testnet');
        });

        /**
         * Ethereum Rinbeky Testnet
         */
        it('Ethereum Rinbeky Testnet', async () => {
            await utils.tapElementByLabel('ETH');

            await utils.expectElementByLabelVisible('You are on Ethereum Rinkeby Testnet');
        });

        /**
         * Ethereum Ropsten Testnet
         */
        it('Ethereum Ropsten Testnet', async () => {
            // Network Options Screen
            await navToNetworkOptionsScreen();

            // Network Options Screen
            await utils.tapElementById('ethereum');

            // Ethereum Screen
            await utils.tapElementByLabel('Ropsten');
            await utils.deviceGoBack('network-selection-screen'); // experimental

            // Dashboard
            await navBackToDashboard();

            await utils.expectElementByLabelVisible('You are on Ethereum Ropsten Testnet');
        });

        /**
         * Ethereum Mainnet
         */
        it('Ethereum Mainnet', async () => {
            // Network Options Screen
            await navToNetworkOptionsScreen();

            // Network Options Screen
            await utils.tapElementById('toggle-testnet');

            // Dashboard
            await navBackToDashboard();

            await utils.expectElementNotVisible('testnet-badge');
        });
    });
});

/**
 * Navigate from Dashboard screen to Network Options Screen
 */
const navToNetworkOptionsScreen = async () => {
    await utils.expectDashboardScreenVisible();

    // Dashboard Screen
    await utils.tapElementByLabel('Settings');

    // Settings Screen
    await utils.tapElementById('Mainnet/Testnet');
};

/**
 * Navigate back from Network Options Screen to Dashboard Screen
 */
const navBackToDashboard = async () => {
    // Go back => Settings Screen
    await utils.tapBackButton();

    // Dashboard Screen
    await utils.tapElementByLabel('Dashboard');

    await utils.expectDashboardScreenVisible();
};
