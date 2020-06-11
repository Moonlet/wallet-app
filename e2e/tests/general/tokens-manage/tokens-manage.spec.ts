import { generateWalletTest, activateMainNetTest } from '../../send/common';
import { zrc2TokensManagementTest } from './zrc2-tokens-manage';
import { erc20TokensManagementTest } from './erc20-tokens.manage';

describe('ZRC2 & ERC20 - Tokens Manage', () => {
    /**
     * Generate wallet
     */
    generateWalletTest();

    /**
     * ZRC2 Tokens Management
     */
    zrc2TokensManagementTest();

    /**
     * Activate Main Net
     */
    activateMainNetTest();

    /**
     * ERC20 Tokens Management
     */
    erc20TokensManagementTest();

    /**
     * Activate Main Net
     */
    activateMainNetTest();
});
