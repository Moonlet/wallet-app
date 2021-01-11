import 'react-native';
import React from 'react';
import App from '../app';
import { loadTranslations } from '../core/i18n';

// Note: test renderer must be required after react-native.
import { shallow } from 'enzyme';
import { delay } from '../core/utils/time';
import * as storeMock from '../redux/config';

jest.mock('../redux/utils/persistConfig');
jest.mock('../redux/config');

jest.mock('../core/i18n/translation/translate', () => ({
    loadTranslations: jest.fn(() => Promise.resolve())
}));

jest.mock('../core/i18n/translation/translate', () => ({
    loadTranslations: jest.fn(() => Promise.resolve())
}));

jest.mock('../core/utils/remote-feature-config', () => ({
    getRemoteConfigFeatures: jest.fn(() => Promise.resolve({})),
    isFeatureActive: jest.fn().mockResolvedValue(true),
    RemoteFeature: {
        COSMOS: 'feature_cosmos'
    }
}));

jest.mock('../core/utils/exchange-rates', () => ({
    subscribeExchangeRateValues: jest.fn(callback => callback({}))
}));

test('renders correctly', async () => {
    const wrapper = shallow(<App />);
    const element: any = wrapper.instance();
    expect(loadTranslations).toHaveBeenCalledWith('en');
    expect(element.state.appReady).toBe(false);
    expect(element.translationsLoaded).toBe(false);
    expect(element.remoteFeatureConfigLoaded).toBe(false);
    expect(element.reduxStateLoaded).toBe(true);
    expect(element.state.splashAnimationDone).toBe(false);

    element.securityChecksDone = true;
    (storeMock as any).triggerStoreSubscribe();
    await delay(1000);

    expect(element.state.splashAnimationDone).toBe(true);
    expect(element.state.appReady).toBe(true);
    expect(element.translationsLoaded).toBe(true);
    expect(element.reduxStateLoaded).toBe(true);
    expect(element.remoteFeatureConfigLoaded).toBe(true);
});
