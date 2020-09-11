import * as utils from '../../utils/detox-utils';
import { generateWalletTest } from '../common/tests';

/**
 * Currency Switch
 */
describe('Currency Switch', () => {
    /**
     * Generate wallet
     */
    generateWalletTest();

    describe('Currency Switch', () => {
        beforeEach(async () => {
            await utils.realoadRNAndEnterPin(utils.PIN_CODE_GENERATE_WALLET);

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
        });

        /**
         * USD - default
         */
        it('USD', async () => {
            // Dashboard Screen
            // Account Amount Converted - Currency
            await utils.expectElementVisible('USD');
        });

        /**
         * EUR
         */
        it('EUR', async () => {
            await changeCurrencyTest('EUR');
        });

        /**
         * GBP
         */
        it('GBP', async () => {
            await changeCurrencyTest('GBP');
        });

        /**
         * USDT
         */
        it('USDT', async () => {
            await changeCurrencyTest('USDT');
        });

        /**
         * DAI
         */
        it('DAI', async () => {
            await changeCurrencyTest('DAI');
        });
    });
});

/**
 * Change currency test
 * @param currency
 */
const changeCurrencyTest = async (currency: string) => {
    // Dashboard Screen
    await navToDefaultCurrencyScreen();

    // Default Currency Screen
    await utils.tapElementById(currency);

    await navBackToDashboard();

    // Dashboard Screen
    // Account Amount Converted - Currency
    await utils.expectElementVisible(currency);
};

/**
 * Navigate from Dashboard screen to Default Currency Screen
 */
const navToDefaultCurrencyScreen = async () => {
    await utils.expectDashboardScreenVisible();

    // Dashboard Screen
    await utils.tapElementByLabel('Settings');

    // Settings Screen
    await utils.tapElementById('Default currency');
};

/**
 * Navigate back from Default Currency Screen to Dashboard Screen
 */
const navBackToDashboard = async () => {
    // Go back => Settings Screen
    await utils.tapBackButton();

    // Dashboard Screen
    await utils.tapElementByLabel('Dashboard');

    await utils.expectDashboardScreenVisible();
};
