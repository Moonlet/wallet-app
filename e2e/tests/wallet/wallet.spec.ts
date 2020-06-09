import { createWalletTest } from './create-wallet';
import { recoverWalletTest } from './recover-wallet';

describe('Wallet', () => {
    // Create Wallet
    createWalletTest();

    // Recover Wallet
    recoverWalletTest();
});
