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
    await utils.elementByLabelTap('ETH');
    await utils.elementByIdTap('token-card-eth');

    // Default Token Screen
    await utils.expectElementVisible('default-token-screen');
    await utils.elementByIdTap('send-button');

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

    // Add DAI - testnet
    await addToken('0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea');

    // Dashboard Screen
    await utils.expectDashboardScreenVisible();
    await utils.elementByIdTap('token-card-dai');

    // Default Token Screen
    await utils.expectElementVisible('default-token-screen');
    await utils.elementByIdTap('send-button');

    // Send
    await sendToken('0.001');

    // Default Token Screen
    await utils.expectElementVisible('default-token-screen');
    await utils.expectElementVisible('transaction-0');
};
