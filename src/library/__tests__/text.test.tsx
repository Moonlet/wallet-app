import React from 'react';
import { NativeModules } from 'react-native';
import { TextComponent, TextSmall, defaultStyleProvider } from '../text';
import { darkTheme } from '../../styles/themes/dark-theme';

const props = defaultStyleProvider(darkTheme);

import { shallow } from 'enzyme';

describe('text library components', () => {
    it('renders correctly regular text', () => {
        const wrapper = shallow(<TextComponent {...props}>dummy</TextComponent>);
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('renders correctly small text', () => {
        const wrapper = shallow(<TextSmall>dummy</TextSmall>);
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('renders correctly formated text', () => {
        const settingsManager = NativeModules.SettingsManager;
        NativeModules.SettingsManager = { settings: { AppleLocale: 'en-US' } };

        const wrapper = shallow(
            <TextComponent {...props} format>
                100.133333333
            </TextComponent>
        );
        expect(wrapper.debug()).toMatchSnapshot();

        NativeModules.SettingsManager = settingsManager;
    });
});
