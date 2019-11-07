import React from 'react';
import { CheckboxComponent, ICheckboxProps } from '../checkbox';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: ICheckboxProps = {
    styles: styleProvider(darkTheme),
    text: 'agree'
};

describe('library checkbox', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<CheckboxComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
