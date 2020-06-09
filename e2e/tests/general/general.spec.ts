import { generateWalletTest } from '../send/common';
import { networkSwitchTest } from './network-switch';
import { walletManagementTest } from './wallet-manage';

describe('General', () => {
    /**
     * Generate wallet
     */
    generateWalletTest();

    /**
     * Network Switch
     */
    networkSwitchTest();

    /**
     * Wallet management
     */
    walletManagementTest();
});
