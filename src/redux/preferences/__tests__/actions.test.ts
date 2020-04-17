import * as actions from '../actions';

jest.mock('../../config');

test('check preference actions to be saved on redux', () => {
    const expectedAction = {
        type: actions.TOGGLE_BIOMETRIC_AUTH
    };
    expect(actions.toggleBiometricAuth()).toEqual(expectedAction);
});
