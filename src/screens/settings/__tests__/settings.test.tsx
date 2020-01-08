import 'react-native';
import React from 'react';
import { SettingsScreenComponent, IProps, IReduxProps } from '../settings';
import { shallow } from 'enzyme';
import styleProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme),
    theme: darkTheme,
    mock: jest.fn(),
    pinLogin: true,
    togglePinLogin: jest.fn()
};
beforeEach(() => {
    // @ts-ignore
    props.mock.mockClear();
});

export default describe('Wallet screen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    it('renders correctly', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('Report issue', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        wrapper.find('[testID="report-issue"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
});
