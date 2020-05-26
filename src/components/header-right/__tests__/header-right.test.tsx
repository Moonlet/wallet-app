import React from 'react';
import { HeaderRightComponent, IProps } from '../header-right';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { IconValues } from '../../icon/values';

const props: IProps = {
    styles: styleProvider(darkTheme),
    icon: IconValues.SETTINGS,
    text: 'text',
    onPress: jest.fn()
};

describe('header go back button', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<HeaderRightComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
