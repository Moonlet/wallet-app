import { appSwitchWallet, appSetTosVersion } from '../actions';
import { Blockchain } from '../../../core/blockchain/types';

describe('app actions', () => {
    test('app action creators', () => {
        expect(appSwitchWallet('1')).toMatchSnapshot();
        expect(appSetTosVersion(1)).toMatchSnapshot();
    });
});
