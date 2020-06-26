import * as utils from '../../utils/detox-utils';
import { generateWalletTest } from '../common/tests';

/**
 * Account Manage
 */
describe('Account Manage', () => {
    /**
     * Generate wallet
     */
    generateWalletTest();

    describe('Zilliqa Account Manage', () => {
        it('Account 1', async () => {
            // Dashboard Screen
            await utils.expectElementVisible('zilliqa-account-1');
        });

        it('Account 2', async () => {
            await selectAccount('zilliqa', 'account-2');
        });

        it('Account 3', async () => {
            await selectAccount('zilliqa', 'account-3');
        });

        it('Account 4', async () => {
            await selectAccount('zilliqa', 'account-4');
        });

        it('Account 5', async () => {
            await selectAccount('zilliqa', 'account-5');
        });
    });

    describe('Ethereum Account Manage', () => {
        it('Account 1', async () => {
            // Dashboard Screen
            await utils.tapElementByLabel('ETH');
            await utils.expectElementVisible('ethereum-account-1');
        });

        it('Account 2', async () => {
            await selectAccount('ethereum', 'account-2');
        });

        it('Account 3', async () => {
            await selectAccount('ethereum', 'account-3');
        });

        it('Account 4', async () => {
            await selectAccount('ethereum', 'account-4');
        });

        it('Account 5', async () => {
            await selectAccount('ethereum', 'account-5');
        });
    });
});

const selectAccount = async (blockchain: string, accountName: string) => {
    const accountTestId = blockchain + '-' + accountName;

    // Dashboard Screen
    await utils.tapElementById('coin-balance-card');

    // Accounts Bottom Sheet
    await utils.expectElementVisible(`card-${blockchain}-account-1`);
    await utils.expectElementVisible(`card-${blockchain}-account-2`);
    await utils.expectElementVisible(`card-${blockchain}-account-3`);
    await utils.expectElementVisible(`card-${blockchain}-account-4`);
    await utils.expectElementVisible(`card-${blockchain}-account-5`);

    await utils.tapElementById(`card-${accountTestId}`);

    // Dashboard Screen
    await utils.expectElementVisible(accountTestId);
};
