import * as actions from '../actions';

test('check preference actions to be saved on redux', () => {
    const expectedAction = {
        type: actions.PREF_SET_PIN
    };
    expect(actions.setPinLogin()).toEqual(expectedAction);
});
