import { appSetAcceptedTcVersion } from '../actions';

describe('app actions', () => {
    test('app action creators', () => {
        expect(appSetAcceptedTcVersion(1)).toMatchSnapshot();
    });
});
