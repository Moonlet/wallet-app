import { generateWalletTest, activateTestNetTest } from '../common/tests';
import { sendEthTest } from './blockchain/eth';
import { sendZilTest } from './blockchain/zil';

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
