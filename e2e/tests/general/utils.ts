import * as utils from '../../utils/utils';

/**
 * Delete Token From Token Manage Screen
 * @param token
 */
export const deleteTokenManageScreen = async (token: string) => {
    // Manage Account Screen
    await utils.tapElementById('manage-account');
    await utils.expectElementVisible(token);
    await utils.swipeElementById(token, 'right'); // swipe right
    await utils.tapElementById(`delete-${token.toLocaleLowerCase()}`); // delete
    await utils.expectElementNotVisible(token);
    await utils.tapBackButton();
};
