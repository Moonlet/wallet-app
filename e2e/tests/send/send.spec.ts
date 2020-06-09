import { generateWalletTest, activateTestNetTest } from './common';
import { sendEthTest } from './eth';
import { sendZilTest } from './zil';

describe('Send', () => {
    // Generate wallet
    generateWalletTest();

    // Activate TestNet
    activateTestNetTest();

    // Send Ethereum
    sendEthTest();

    // Send Zilliqa
    sendZilTest();
});
