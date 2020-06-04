import { createWalletFreshInstall, createAnotherWallet } from './create-wallet';
import { recoverWalletFreshInstall, recoverAnotherWallet } from './recover-wallet';

describe('Wallet', () => {
    /**
     * Create Wallet
     */
    describe('Create Wallet', () => {
        it('Fresh install', async () => {
            await createWalletFreshInstall();
        });

        it('Create another wallet', async () => {
            await createAnotherWallet();
        });
    });

    /**
     * Recover Wallet
     */
    describe('Recover Wallet', () => {
        it('Fresh install', async () => {
            await recoverWalletFreshInstall();
        });

        it('Recover another wallet', async () => {
            await recoverAnotherWallet();
        });
    });
});
