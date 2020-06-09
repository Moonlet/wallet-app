import { getProps } from 'detox-getprops';
import * as customKeyboard from './custom-keyboard';

/**
 * Tap element by id
 * @param key
 */
export const tapElementById = async (key: string) => element(by.id(key)).tap();

/**
 * Tap element by label
 * @param key
 */
export const tapElementByLabel = async (key: string) => element(by.label(key)).tap();

/**
 * Expect Element By id to have label
 * @param key
 */
export const expectElementVisible = async (key: string) =>
    (expect(element(by.id(key))) as any).toBeVisible();

/**
 * Expect Element Not to be visible
 * @param key
 */

export const expectElementNotVisible = async (key: string) =>
    (expect(element(by.id(key))) as any).toBeNotVisible();

/**
 * Expect Element By llabel to be visible
 * @param key
 */
export const expectElementByLabelVisible = async (key: string) =>
    (expect(element(by.label(key))) as any).toBeVisible();

/**
 * Expect Element By id to have text
 * @param key
 * @param text
 */
export const expectElementByIdToHaveText = async (key: string, text: string) =>
    (expect(element(by.label(key))) as any).toHaveText(text);

/**
 * Expect Element By id to have label
 * @param key
 * @param label
 */
export const expectElementByIdToHaveLabel = async (key: string, label: string) =>
    (expect(element(by.label(key))) as any).toHaveLabel(label);

/**
 * Get text of a component <Text />
 * @param key
 */
export const getElementTextById = async (key: string) =>
    ((await getProps(element(by.id(key)))) as any).text;

/**
 * Go back to the previous screen by pressing the left-arrow button
 */
export const tapBackButton = async () => element(by.id('go-back')).tap();

/**
 * Go back to the previous screen
 * @param currentScreen
 * - Android: by using the device press back
 * - iOS: swipe right on the current screen
 *
 * Experimental, need to be tested better
 */
export const deviceGoBack = async (currentScreen: string) => {
    try {
        if (device.getPlatform() === 'android') {
            await device.pressBack(); // Android only
        } else {
            await element(by.id(currentScreen)).swipe('right', 'fast', 0.1);
        }
    } catch {
        await tapBackButton();
    }
};

/**
 * Type Text / element by id Type Text - applied on <TextInput /> component
 * @param key
 * @param value the value that is received by <TextInput />
 */
export const typeTextElementById = async (key: string, value: string) =>
    element(by.id(key)).typeText(value);

/**
 * Replace text / element by id Type Text - applied on <TextInput /> component
 * @param key
 * @param value the value that is received by <TextInput />
 */
export const replaceTextElementById = async (key: string, value: string) =>
    element(by.id(key)).replaceText(value);

/**
 * Reload React Native App, Enter Pin Code, Dashboard is displayed
 * @param pin the passcode of Moonlet
 */
export const realoadRNAndEnterPin = async (pin: string) => {
    await device.reloadReactNative();

    // Password Pin Screen
    await customKeyboard.typeWord(pin); // enter pin code
};

/**
 * Expect Dashboard Screen to be visible
 */
export const expectDashboardScreenVisible = async () => expectElementVisible('dashboard-screen');

/**
 * Pin Code for the Generate Wallet
 * Maybe consider this later to be stored in secrets
 */
export const PIN_CODE_GENERATE_WALLET = '000000';

/**
 * Swipe element by id
 * @param key
 * @param direction
 * @param speed - fast/slow - default is fast
 * @param percentage - (optional) screen percentage to swipe; valid input: [0.0, 1.0]
 */
export const swipeElementById = async (
    key: string,
    direction: 'left' | 'right' | 'top' | 'bottom' | 'up' | 'down',
    speed?: 'fast' | 'slow',
    percentage?: number
) => element(by.id(key)).swipe(direction, speed, percentage);

/**
 * Swipe element by label
 * @param key
 * @param direction
 * @param speed - fast/slow - default is fast
 * @param percentage - (optional) screen percentage to swipe; valid input: [0.0, 1.0]
 */
export const swipeElementByLabel = async (
    key: string,
    direction: 'left' | 'right' | 'top' | 'bottom' | 'up' | 'down',
    speed?: 'fast' | 'slow',
    percentage?: number
) => element(by.label(key)).swipe(direction, speed, percentage);
