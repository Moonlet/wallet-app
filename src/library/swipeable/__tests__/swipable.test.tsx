import React from 'react';
import { Swipeable, ISwipableProps } from '../swipeable';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: ISwipableProps = {
    styles: styleProvider(darkTheme),
    children: null,
    renderLeftActions: () => 'left'
};

describe('library checkbox', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<Swipeable {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
