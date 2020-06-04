import { generateWallet, activateTestNet } from './common';
import { sendEthNative, sendERC2DAI } from './eth';
import { sendZilNative, sendZRC2XSGD } from './zil';

describe('Send', () => {
    /**
     * Generate wallet and activate TestNet
     */
    it('Generate wallet and activate testnet', async () => {
        await generateWallet();

        await activateTestNet();
    });

    /**
     * Send Ethereum
     */
    describe('Send ETH', () => {
        it('Native', async () => {
            await sendEthNative();
        });

        it('ERC2 - DAI', async () => {
            await sendERC2DAI();
        });
    });

    /**
     * Send Zilliqa
     */
    describe('Send ZIL', () => {
        it('Native', async () => {
            await sendZilNative();
        });

        it('ZRC2 - XSGD', async () => {
            await sendZRC2XSGD();
        });
    });
});
