import React from 'react';
import { shallow } from 'enzyme';
import { AccountScreenComponent, AccountScreen, mapStateToProps } from '../account';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';

export default describe('AccountScreen', () => {
    test('renders correctly', () => {
        const props = {
            styles: stylesProvider(darkTheme),
            navigation: {} as any,
            account: {} as any
        };

        mapStateToProps({} as any, {} as any); // trick coverage
        expect(shallow(<AccountScreenComponent {...props} />).debug()).toMatchSnapshot();
        expect(shallow(<AccountScreen />).debug()).toMatchSnapshot();
    });
});
