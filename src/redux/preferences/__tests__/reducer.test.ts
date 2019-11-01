import reducer from '../reducer';
import * as actions from '../actions';

describe('preferences reducer', () => {
    test('should set initial state', () => {
        const initialState = {
            currency: 'USD',
            pinLogin: true
        };
        expect(
            reducer(initialState, {
                type: '',
                data: ''
            })
        ).toEqual({ currency: 'USD', pinLogin: true });
    });

    test('should handle PREF_SET_PIN', () => {
        const initialState = {
            currency: 'USD',
            pinLogin: true
        };
        expect(
            reducer(initialState, {
                type: actions.PREF_SET_PIN,
                data: ''
            })
        ).toEqual({ currency: 'USD', pinLogin: false });
    });
});
