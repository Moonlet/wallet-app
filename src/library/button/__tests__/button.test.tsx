import React from 'react';
import { ButtonComponent, IButtonProps } from '../button';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IButtonProps = {
    styles: styleProvider(darkTheme)
};

describe('library button', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<ButtonComponent {...props}>dummy</ButtonComponent>);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
