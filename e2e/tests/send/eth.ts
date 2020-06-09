import * as utils from '../../utils/utils';
import { sendToken, addToken } from './common';

/**
 * ETH Native
 * - testnet
 *
 */
export const sendEthNative = async () => {
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
};

/**
 * ETH ERC2
 * - DAI token
 * - testnet
 *
 */
export const sendERC2DAI = async () => {
    await utils.realoadRNAndEnterPin(utils.PIN_CODE_GENERATE_WALLET);

    // Dashboard Screen
    await utils.expectDashboardScreenVisible();

    // Add DAI - testnet
    await addToken('0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea');

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
};
