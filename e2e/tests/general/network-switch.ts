import * as utils from '../../utils/utils';

/**
 * Network Switch
 */
export const networkSwitchTest = () => {
    describe('Network Switch', () => {
        beforeEach(async () => {
            await utils.realoadRNAndEnterPin(utils.PIN_CODE_GENERATE_WALLET);
        });

        it('network switch', async () => {
            // Dashboard Screen
            // Zilliqa Mainnet active
            await utils.expectElementNotVisible('testnet-badge');
        });

        it('it works on zilliqa dev testnet', async () => {
            // Zilliqa Dev Testnet
            await zilDevTestnet();
        });

        it('it works on zilliqa kaya local testnet', async () => {
            // Zilliqa Kaya Local Testnet
            await zilKayaLocalTestnet();
        });

        it('it works on ethereum rinkeby testnet', async () => {
            // Ethereum Rinkeby Testnet
            await ethRinkebyTestnet();
        });

        it('it works on ethereum ropsten testnet', async () => {
            // Ethereum Ropsten Testnet
            await ethRopstenTestnet();
        });

        it('it works on ethereum mainnet', async () => {
            // Ethereum Mainnet
            await ethMainnet();
        });
    });
};

/**
 * Zilliqa Dev Testnet
 */
const zilDevTestnet = async () => {
    // Network Options Screen
    await navToNetworkOptionsScreen();

    // Network Options Screen
    await utils.tapElementById('toggle-testnet');

    // Dashboard
    await navBackToDashboard();

    await utils.expectElementByLabelVisible('You are on Zilliqa Dev Testnet');
};

/**
 * Zilliqa Kaya Local Testnet
 */
const zilKayaLocalTestnet = async () => {
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
};

/**
 * Ethereum Rinbeky Testnet
 */
const ethRinkebyTestnet = async () => {
    await utils.tapElementByLabel('ETH');

    await utils.expectElementByLabelVisible('You are on Ethereum Rinkeby Testnet');
};

/**
 * Ethereum Ropsten Testnet
 */
const ethRopstenTestnet = async () => {
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
};

/**
 * Ethereum Mainnet
 */
const ethMainnet = async () => {
    // Network Options Screen
    await navToNetworkOptionsScreen();

    // Network Options Screen
    await utils.tapElementById('toggle-testnet');

    // Dashboard
    await navBackToDashboard();

    await utils.expectElementNotVisible('testnet-badge');
};

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
