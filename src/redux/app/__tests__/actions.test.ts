import { appSwitchWallet, appSetTosVersion } from '../actions';

describe('app actions', () => {
    test('app action creators', () => {
        expect(appSwitchWallet(1)).toMatchSnapshot();
        expect(appSetTosVersion(1)).toMatchSnapshot();
    });
});
