import 'react-native';
import React from 'react';
import App from '../app';
import { loadTranslations } from '../core/i18n';

// Note: test renderer must be required after react-native.
import { shallow } from 'enzyme';
import { timeUtils } from '../core/utils/time';
import * as storeMock from '../redux/config';

jest.mock('../redux/config');

jest.mock('../core/i18n/translation/translate', () => ({
    loadTranslations: jest.fn(() => Promise.resolve())
}));

test('renders correctly', async () => {
    const wrapper = shallow(<App />);
    const element: any = wrapper.instance();
    expect(loadTranslations).toHaveBeenCalledWith('en');
    expect(element.state.appReady).toBe(false);
    expect(element.translationsLoaded).toBe(false);
    expect(element.reduxStateLoaded).toBe(false);

    (storeMock as any).triggerStoreSubscribe();
    await timeUtils.delay();

    expect(element.state.appReady).toBe(true);
    expect(element.translationsLoaded).toBe(true);
    expect(element.reduxStateLoaded).toBe(true);
});
