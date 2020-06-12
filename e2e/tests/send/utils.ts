import * as utils from '../../utils/detox-utils';
import * as customKeyboard from '../../utils/custom-keyboard';

/**
 * Send Token
 * @param amount
 */
export const sendToken = async (amount: string) => {
    // Send Screen

    // Select address
    await utils.tapElementById('transfer-between-accounts');
    await utils.tapElementById('account-2');
    await utils.tapElementById('next');

    // Enter amount
    await utils.typeTextElementById('enter-amount', amount);
    await utils.tapElementById('next');

    // Confirm Transaction
    await utils.tapElementById('confirm');

    // Password Pin Screen
    await utils.expectElementVisible('password-pin-screen');
    await customKeyboard.typeWord(utils.PIN_CODE_GENERATE_WALLET); // enter pin code
};
