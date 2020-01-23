import reducer from '../reducer';
import { APP_SET_TOS_VERSION } from '../actions';

describe('app reducer', () => {
    test('should set initial state', () => {
        expect(
            reducer(undefined as any, {
                type: '',
                data: ''
            })
        ).toMatchSnapshot();
    });

    test('should handle APP_SET_TOS_VERSION', () => {
        expect(
            reducer(undefined as any, {
                type: APP_SET_TOS_VERSION,
                data: 3
            }).tosVersion
        ).toBe(3);
    });
});
