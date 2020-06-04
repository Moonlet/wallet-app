import * as utils from '../utils/utils';
import * as customKeyboard from '../utils/custom-keyboard';
import { generateWallet, activateTestNet } from './common';

const addToken = async (contractAddress: string) => {
    await utils.elementByIdTap('dashboard-menu-icon');

    // Manage Account Screen
    await utils.elementByIdTap('manage-account');
    await utils.elementByIdTap('add-icon');

    // Manage Token Screen
    await utils.elementTypeText('search-input', contractAddress);
    await utils.elementByLabelTap('Find');
    await utils.elementByIdTap('found-token');
    await utils.elementByLabelTap('Save');

    await utils.goBack();
};

const sendToken = async (amount: string) => {
    // Send Screen

    // Select address
    await utils.elementByIdTap('transfer-between-accounts');
    await utils.elementByIdTap('account-2');
    await utils.elementByIdTap('next');

    // Enter amount
    await utils.elementTypeText('enter-amount', amount);
    await utils.elementByIdTap('next');

    // Confirm Transaction
    await utils.elementByIdTap('confirm');

    // Password Pin Screen
    await utils.expectElementVisible('password-pin-screen');
    await customKeyboard.typeWord('000000'); // enter pin code
};

describe('Send', () => {
    it('Generate wallet and activate testnet', async () => {
        await generateWallet();

        await activateTestNet();
    });

    describe('Send ETH', () => {
        it('Native', async () => {
            // Dashboard Screen
            await utils.expectElementVisible('dashboard-screen');
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
        });

        it('ERC2 - DAI', async () => {
            await utils.realoadRNAndEnterPin('000000');

            // Add DAI - testnet
            await addToken('0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea');

            // Dashboard Screen
            await utils.expectElementVisible('dashboard-screen');
            await utils.elementByIdTap('token-card-dai');

            // Default Token Screen
            await utils.expectElementVisible('default-token-screen');
            await utils.elementByIdTap('send-button');

            // Send
            await sendToken('0.001');

            // Default Token Screen
            await utils.expectElementVisible('default-token-screen');
            await utils.expectElementVisible('transaction-0');
        });
    });

    describe('Send ZIL', () => {
        it('Native', async () => {
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
            await utils.expectElementVisible('transaction-0');
        });

        it('ZRC2 - XSGD', async () => {
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
            await utils.expectElementVisible('transaction-0');
        });
    });
});
