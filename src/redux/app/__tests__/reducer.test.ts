import reducer from '../reducer';
import { SET_TC_VERSION } from '../actions';

describe('app reducer', () => {
    test('should set initial state', () => {
        expect(
            reducer(undefined as any, {
                type: '',
                data: ''
            })
        ).toMatchSnapshot();
    });

    test('should handle SET_TC_VERSION', () => {
        expect(
            reducer(undefined as any, {
                type: SET_TC_VERSION,
                data: 3
            }).tcVersion
        ).toBe(3);
    });
});
