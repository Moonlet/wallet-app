import { getProps } from 'detox-getprops';
import * as customKeyboard from './custom-keyboard';

/**
 * Tap element by id
 * @param key
 */
export const elementByIdTap = async (key: string) => element(by.id(key)).tap();

/**
 * Tap element by label
 * @param key
 */
export const elementByLabelTap = async (key: string) => element(by.label(key)).tap();

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
export const getText = async (key: string) => ((await getProps(element(by.id(key)))) as any).text;

/**
 * Go back to the previous screen by pressing the left-arrow button
 */
export const goBack = async () => element(by.id('go-back')).tap();

/**
 * Go back to the previous screen
 * @param currentScreen
 * - Android: by using the device press back
 * - iOS: swipe right on the current screen
 *
 * Experimental, need to be tested better
 */
export const pressBack = async (currentScreen: string) => {
    try {
        if (device.getPlatform() === 'android') {
            await device.pressBack(); // Android only
        } else {
            await element(by.id(currentScreen)).swipe('right', 'fast', 0.1);
        }
    } catch {
        await goBack();
    }
};

/**
 * Element by id Type Text - applied on <TextInput /> component
 * @param key
 * @param value the value that is received by <TextInput />
 */
export const elementTypeText = async (key: string, value: string) =>
    element(by.id(key)).typeText(value);

/**
 * Reload React Native App, Enter Pin Code, Dashboard is displayed
 * @param pin the passcode of Moonlet
 */
export const realoadRNAndEnterPin = async (pin: string) => {
    await device.reloadReactNative();

    // Password Pin Screen
    await expectElementVisible('password-pin-screen');
    await customKeyboard.typeWord(pin); // enter pin code

    // Dashboard Screen
    await expectDashboardScreenVisible();
};

/**
 * Expect Dashboard Screen to be visible
 */
export const expectDashboardScreenVisible = async () => expectElementVisible('dashboard-screen');
