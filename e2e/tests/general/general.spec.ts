import { generateWallet } from '../send/common';
import { networkSwitch } from './network-switch';

describe('General', () => {
    /**
     * Generate wallet
     */
    it('Generate wallet', async () => {
        await generateWallet();
    });

    /**
     * Netword Switch
     */
    it('Network Switch', async () => {
        await networkSwitch();
    });
});
