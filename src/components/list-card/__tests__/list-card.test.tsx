import 'react-native';
import React from 'react';
import { ListCardComponent, IProps } from '../list-card';
import stylesProvider from '../styles';

import { shallow } from 'enzyme';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { IThemeProps } from '../../../core/theme/with-theme';

const props: IProps & IThemeProps<ReturnType<typeof stylesProvider>> = {
    label: 'card',
    leftIcon: 'money-wallet-1',
    rightIcon: 'chevron-right',
    selected: true,
    onPress: jest.fn(),
    styles: stylesProvider(darkTheme),
    theme: darkTheme
};

describe('CardList component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<ListCardComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
