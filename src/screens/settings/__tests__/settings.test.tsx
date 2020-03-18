import 'react-native';
import React from 'react';
import { SettingsScreenComponent, IReduxProps } from '../settings';
import { shallow } from 'enzyme';
import styleProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';

jest.mock('../../../redux/config');

const props: IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme),
    theme: darkTheme
};

export default describe('Wallet screen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    it('renders correctly', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
