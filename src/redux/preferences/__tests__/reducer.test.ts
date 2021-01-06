import reducer from '../reducer';
import * as actions from '../actions';
import { Blockchain } from '../../../core/blockchain/types';

jest.mock('../../config');

describe('preferences reducer', () => {
    test('should set initial state', () => {
        expect(
            reducer(undefined as any, {
                type: '',
                data: ''
            })
        ).toMatchSnapshot();
    });

    test('should handle TOGGLE_BIOMETRIC_AUTH', () => {
        expect(
            reducer(undefined as any, {
                type: actions.TOGGLE_BIOMETRIC_AUTH,
                data: ''
            })
        ).toEqual({
            currency: 'USD',
            testNet: false,
            biometricActive: true,
            networks: {},
            blockchains: {},
            deviceId: '',
            cumulativeBalance: false
        });
    });
});
