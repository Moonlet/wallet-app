import * as actions from '../actions';

test('check preference actions to be saved on redux', () => {
    const expectedAction = {
        type: actions.TOGGLE_PIN_LOGIN
    };
    expect(actions.togglePinLogin()).toEqual(expectedAction);
});
