import * as utils from '../../utils/utils';
import { sendToken, addToken } from '../common';

/**
 * ZIL Native
 * - testnet
 *
 */
export const sendZilNative = async () => {
    await utils.realoadRNAndEnterPin('000000');

    // Dashboard Screen
    await utils.expectElementVisible('dashboard-screen');
    await utils.elementByLabelTap('ZIL');
    await utils.elementByIdTap('token-card-zil');

    // Delegate Token Screen
    await utils.expectElementVisible('delegate-token-screen');
    await utils.elementByLabelTap('Send');

    // Send
    await sendToken('0.001');

    // Delegate Token Screen
    await utils.expectElementVisible('delegate-token-screen');
};

/**
 * ZIL ZRC2
 * - XSGD token
 * - testnet
 *
 */
export const sendZRC2XSGD = async () => {
    await utils.realoadRNAndEnterPin('000000');

    // Add XSGD - testnet
    await addToken('zil1nnwugt0e5cvf2welmyq93q6p6t7zfdjzz7s05u');

    // Dashboard Screen
    await utils.expectElementVisible('dashboard-screen');
    await utils.elementByIdTap('token-card-xsgd');

    // Delegate Token Screen
    await utils.expectElementVisible('delegate-token-screen');
    await utils.elementByLabelTap('Send');

    // Send
    await sendToken('0.001');

    // Delegate Token Screen
    await utils.expectElementVisible('delegate-token-screen');
};
