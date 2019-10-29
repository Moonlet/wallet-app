import 'react-native';
import React from 'react';
import App from '../app';
import { loadTranslations } from '../core/i18n';

// Note: test renderer must be required after react-native.
import { shallow } from 'enzyme';

jest.mock('../core/i18n/translation/translate', () => ({
    loadTranslations: jest.fn(() => Promise.resolve())
}));

const delay = (time?: number) => new Promise(resolver => setTimeout(() => resolver(), time));

test('renders correctly', async () => {
    const wrapper = shallow(<App />);
    const element: any = wrapper.instance();
    expect(loadTranslations).toHaveBeenCalledWith('en');
    expect(element.state.appReady).toBe(false);
    expect(element.state.translationsLoaded).toBe(false);

    await delay(1);
    expect(element.state.appReady).toBe(true);
    expect(element.state.translationsLoaded).toBe(true);
});
