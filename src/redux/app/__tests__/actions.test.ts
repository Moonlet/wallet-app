import { appSetTcVersion } from '../actions';

describe('app actions', () => {
    test('app action creators', () => {
        expect(appSetTcVersion(1)).toMatchSnapshot();
    });
});
