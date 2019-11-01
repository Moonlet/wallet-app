import reducer from '../reducer';
import * as actions from '../actions';

describe('preferences reducer', () => {
    test('should set initial state', () => {
        expect(
            reducer(undefined as any, {
                type: '',
                data: ''
            })
        ).toMatchSnapshot();
    });

    test('should handle PREF_SET_PIN', () => {
        expect(
            reducer(undefined as any, {
                type: actions.PREF_SET_PIN,
                data: ''
            })
        ).toEqual({ currency: 'USD', pinLogin: false });
    });
});
