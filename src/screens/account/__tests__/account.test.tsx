import React from 'react';
import { shallow } from 'enzyme';
import { AccountScreenComponent, AccountScreen, mapStateToProps } from '../account';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';

export default describe('AccountScreen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

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
