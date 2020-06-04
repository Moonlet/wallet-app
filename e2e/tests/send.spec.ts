import * as utils from '../utils/utils';
import { generateWallet, activateTestNet, sendToken, addToken } from './common';

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
