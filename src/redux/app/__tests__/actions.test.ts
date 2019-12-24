import { appSwitchWallet, appSetTosVersion, appSwitchAccount } from '../actions';
import { Blockchain } from '../../../core/blockchain/types';

describe('app actions', () => {
    test('app action creators', () => {
        expect(appSwitchWallet('1')).toMatchSnapshot();
        expect(appSetTosVersion(1)).toMatchSnapshot();
        expect(appSwitchAccount({ index: 0, blockchain: Blockchain.ETHEREUM })).toMatchSnapshot();
    });
});
