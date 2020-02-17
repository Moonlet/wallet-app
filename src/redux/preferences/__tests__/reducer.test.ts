import reducer from '../reducer';
import * as actions from '../actions';
import { Blockchain } from '../../../core/blockchain/types';

describe('preferences reducer', () => {
    test('should set initial state', () => {
        expect(
            reducer(undefined as any, {
                type: '',
                data: ''
            })
        ).toMatchSnapshot();
    });

    test('should handle TOGGLE_TOUCH_ID', () => {
        expect(
            reducer(undefined as any, {
                type: actions.TOGGLE_TOUCH_ID,
                data: ''
            })
        ).toEqual({
            currency: 'USD',
            testNet: false,
            touchID: true,
            networks: {},
            blockchains: {}
        });
    });
});
