import { appSetTcVersion } from '../actions';
import { Blockchain } from '../../../core/blockchain/types';

describe('app actions', () => {
    test('app action creators', () => {
        expect(appSetTcVersion(1)).toMatchSnapshot();
    });
});
