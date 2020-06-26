import * as utils from '../../utils/detox-utils';

/**
 * Add Token
 * @param contractAddress
 */
export const addToken = async (contractAddress: string) => {
    await utils.tapElementById('dashboard-menu-icon');

    // Manage Account Screen
    await utils.tapElementById('manage-account');
    await utils.tapElementById('add-icon');

    // Manage Token Screen
    await utils.typeTextElementById('search-input', contractAddress);
    await utils.tapElementByLabel('Find');
    await utils.tapElementById('found-token');
    await utils.tapElementByLabel('Save');

    await utils.tapBackButton();
};
