import * as utils from '../../utils/utils';
import * as customKeyboard from '../../utils/custom-keyboard';
import { delay } from '../../../src/core/utils/time';
import { generateWalletTest } from '../send/common';

describe('Wallet management', () => {
    /**
     *  Generate wallet
     */
    generateWalletTest();

    it('Wallet management', async () => {
        // Dashboard Screen
        await utils.expectElementByLabelVisible('Wallet 1');
        await utils.tapElementById('wallets-icon');

        // Wallets Screen
        await utils.expectElementVisible('wallets-screen');

        // Create another wallet
        await createAnotherWallet();

        // Dashboard Screen
        await utils.expectDashboardScreenVisible();
        await utils.expectElementByLabelVisible('Wallet 2');
        await utils.tapElementById('wallets-icon');

        // Wallets Screen
        await utils.expectElementVisible('wallets-screen');
        await utils.expectElementVisible('wallet-1');
        await utils.expectElementVisible('wallet-2');

        // Wallet edit name - TODO: not working <TextInput testID=""/> on our Dialog Component
        // await walletEditName('wallet-1);

        // Delete Wallet 2
        await deleteWallet('wallet-2');

        // Wallets Screen
        await utils.expectElementVisible('wallets-screen');

        // Delete Wallet 1
        await deleteWallet('wallet-1');

        // Onboarding Screen
        await utils.expectElementVisible('onboarding-screen');
    });
});

/**
 * Delete Wallet
 */
const deleteWallet = async (walletKey: string) => {
    // Wait until show hints has finished
    await delay(500);

    // walletKey
    await utils.swipeElementById(walletKey, 'right');
    await utils.tapElementById(`delete-${walletKey}`);
    await utils.tapElementByLabel('OK');
    await customKeyboard.typeWord(utils.PIN_CODE_GENERATE_WALLET);
};

/**
 * Wallet edit name
 */
const walletEditName = async (walletKey: string) => {
    await utils.swipeElementById(walletKey, 'right');
    await utils.tapElementById(`edit-name-${walletKey}`);
    await utils.tapElementByLabel('Edit name');

    // TODO: this is not working
    // testID is not working on RNDialog.Input
    await utils.typeTextElementById('dialog-input', 'Moonlet Wallet');
    await utils.tapElementByLabel('Save');
};

const createAnotherWallet = async () => {
    await utils.tapElementById('create-button');
    await utils.tapElementById('copy-mnemonic');
    await utils.tapBackButton();
    await utils.tapElementById('recover-button');
    await utils.tapElementById('paste-button');
    await customKeyboard.tapConfirmButton();
    await customKeyboard.typeWord(utils.PIN_CODE_GENERATE_WALLET);
};
