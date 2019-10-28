import React from 'react';
import { TosScreenComponent, IProps } from '../tos';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme)
};

describe('tos screen component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<TosScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
