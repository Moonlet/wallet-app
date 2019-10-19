import 'react-native';
import React from 'react';
import { SettingsScreen } from '../settings';

import { shallow } from 'enzyme';

describe('settings screen component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<SettingsScreen />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
