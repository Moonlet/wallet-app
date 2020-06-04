import { getProps } from 'detox-getprops';
import * as customKeyboard from './custom-keyboard';

export const elementByIdTap = async (key: string) => element(by.id(key)).tap();

export const elementByLabelTap = async (key: string) => element(by.label(key)).tap();

export const expectElementVisible = async (key: string) =>
    (expect(element(by.id(key))) as any).toBeVisible();

export const expectElementNotVisible = async (key: string) =>
    (expect(element(by.id(key))) as any).toBeNotVisible();

export const expectElementByLabelVisible = async (key: string) =>
    (expect(element(by.label(key))) as any).toBeVisible();

export const getText = async (key: string) => ((await getProps(element(by.id(key)))) as any).text;

export const goBack = async () => element(by.id('go-back')).tap();

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

export const elementTypeText = async (key: string, value: string) =>
    element(by.id(key)).typeText(value);

export const realoadRNAndEnterPin = async (pin: string) => {
    await device.reloadReactNative();

    // Password Pin Screen
    await expectElementVisible('password-pin-screen');
    await customKeyboard.typeWord(pin); // enter pin code

    // Dashboard Screen
    await expectDashboardScreenVisible();
};

export const expectDashboardScreenVisible = async () => expectElementVisible('dashboard-screen');
