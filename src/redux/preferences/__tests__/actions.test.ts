import * as actions from '../actions';

jest.mock('../../config');

test('check preference actions to be saved on redux', () => {
    const expectedAction = {
        type: actions.TOGGLE_TOUCH_ID
    };
    expect(actions.toggleTouchID()).toEqual(expectedAction);
});
