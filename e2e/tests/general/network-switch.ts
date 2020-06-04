import * as utils from '../../utils/utils';

/**
 * Network Switch
 */
export const networkSwitch = async () => {
    await utils.realoadRNAndEnterPin('000000');

    // Dashboard Screen
    // Zilliqa Mainnet active
    await utils.expectElementNotVisible('testnet-badge');

    // Zilliqa Dev Testnet
    await zilDevTestnet();

    await utils.realoadRNAndEnterPin('000000');

    // Zilliqa Kaya Local Testnet
    await zilKayaLocalTestnet();

    await utils.realoadRNAndEnterPin('000000');

    // Ethereum Rinkeby Testnet
    await ethRinkebyTestnet();

    await utils.realoadRNAndEnterPin('000000');

    // Ethereum Ropsten Testnet
    await ethRopstenTestnet();

    await utils.realoadRNAndEnterPin('000000');

    // Ethereum Mainnet
    await ethMainnet();
};

/**
 * Zilliqa Dev Testnet
 */
const zilDevTestnet = async () => {
    // Network Options Screen
    await navToNetworkOptionsScreen();

    // Network Options Screen
    await utils.elementByIdTap('toggle-testnet');

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
    await utils.elementByIdTap('zilliqa');

    // Zilliqa Screen
    await utils.elementByLabelTap('Kaya Local');
    await utils.pressBack('network-selection-screen'); // TODO: experimental

    // Dashboard
    await navBackToDashboard();

    await utils.expectElementByLabelVisible('You are on Zilliqa Kaya Local Testnet');
};

/**
 * Ethereum Rinbeky Testnet
 */
const ethRinkebyTestnet = async () => {
    await utils.elementByLabelTap('ETH');

    await utils.expectElementByLabelVisible('You are on Ethereum Rinkeby Testnet');
};

/**
 * Ethereum Ropsten Testnet
 */
const ethRopstenTestnet = async () => {
    // Network Options Screen
    await navToNetworkOptionsScreen();

    // Network Options Screen
    await utils.elementByIdTap('ethereum');

    // Ethereum Screen
    await utils.elementByLabelTap('Ropsten');
    await utils.pressBack('network-selection-screen'); // TODO: experimental

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
    await utils.elementByIdTap('toggle-testnet');

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
    await utils.elementByLabelTap('Settings');

    // Settings Screen
    await utils.elementByIdTap('Mainnet/Testnet');
};

/**
 * Navigate back from Network Options Screen to Dashboard Screen
 */
const navBackToDashboard = async () => {
    // Go back => Settings Screen
    await utils.goBack();

    // Dashboard Screen
    await utils.elementByLabelTap('Dashboard');

    await utils.expectDashboardScreenVisible();
};
