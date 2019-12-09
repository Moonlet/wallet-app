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

    test('should handle TOGGLE_PIN_LOGIN', () => {
        expect(
            reducer(undefined as any, {
                type: actions.TOGGLE_PIN_LOGIN,
                data: ''
            })
        ).toEqual({ currency: 'USD', pinLogin: false });
    });
});
