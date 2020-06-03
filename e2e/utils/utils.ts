import { getProps } from 'detox-getprops';

export const elementTap = async (key: string) => element(by.id(key)).tap();

export const expectElementVisible = async (key: string) =>
    (expect(element(by.id(key))) as any).toBeVisible();

export const getText = async (key: string) => ((await getProps(element(by.id(key)))) as any).text;
