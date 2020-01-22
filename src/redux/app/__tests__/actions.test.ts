import { appSetTosVersion } from '../actions';
import { Blockchain } from '../../../core/blockchain/types';

describe('app actions', () => {
    test('app action creators', () => {
        expect(appSetTosVersion(1)).toMatchSnapshot();
    });
});
