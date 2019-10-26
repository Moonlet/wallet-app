import React from 'react';
import { HeaderLeftComponent, IProps } from '../header-left';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps = {
    styles: styleProvider(darkTheme),
    icon: 'cog',
    text: 'text',
    onPress: jest.fn()
};

describe('header go back button', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<HeaderLeftComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
