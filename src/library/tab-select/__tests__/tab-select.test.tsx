import React from 'react';
import { TabSelectComponent, ITabSelectProps } from '../tab-select';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: ITabSelectProps = {
    styles: styleProvider(darkTheme),
    options: {
        '1': 'a',
        '2': 'b',
        '3': 'c'
    },
    selected: '2',
    onSelectionChange: jest.fn()
};

describe('library checkbox', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<TabSelectComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
