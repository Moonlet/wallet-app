import * as utils from '../../utils/utils';
import * as customKeyboard from '../../utils/custom-keyboard';
import { delay } from '../../../src/core/utils/time';

/**
 * Delete Wallet
 */
const deleteWallet = async (walletKey: string) => {
    // Wait until show hints has finished
    await delay(500);

    // walletKey
    await utils.elementByIdSwipe(walletKey, 'right');
    await utils.elementByIdTap(`delete-${walletKey}`);
    await utils.elementByLabelTap('OK');
    await customKeyboard.typeWord(utils.PIN_CODE_GENERATE_WALLET);
};

/**
 * Wallet edit name
 */
const walletEditName = async (walletKey: string) => {
    await utils.elementByIdSwipe(walletKey, 'right');
    await utils.elementByIdTap(`edit-name-${walletKey}`);
    await utils.elementByLabelTap('Edit name');

    // TODO: this is not working
    // testID is not working on RNDialog.Input
    await utils.elementTypeText('dialog-input', 'Moonlet Wallet');
    await utils.elementByLabelTap('Save');
};

const createAnotherWallet = async () => {
    await utils.elementByIdTap('create-button');
    await utils.elementByIdTap('copy-mnemonic');
    await utils.goBack();
    await utils.elementByIdTap('recover-button');
    await utils.elementByIdTap('paste-button');
    await customKeyboard.confirmButtonTap();
    await customKeyboard.typeWord(utils.PIN_CODE_GENERATE_WALLET);
};

/**
 * Wallet management
 */
export const walletManagementTest = () => {
    describe('Wallet management', () => {
        it('wallet management', async () => {
            // Dashboard Screen
            await utils.expectElementByLabelVisible('Wallet 1');
            await utils.elementByIdTap('wallets-icon');

            // Wallets Screen
            await utils.expectElementVisible('wallets-screen');

            // Create another wallet
            await createAnotherWallet();

            // Dashboard Screen
            await utils.expectDashboardScreenVisible();
            await utils.expectElementByLabelVisible('Wallet 2');
            await utils.elementByIdTap('wallets-icon');

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
};
