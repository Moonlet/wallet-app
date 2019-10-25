import React from 'react';
import { GoBackButtonComponent, IProps } from '../go-back-button';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps = {
    styles: styleProvider(darkTheme)
};

describe('header go back button', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<GoBackButtonComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
