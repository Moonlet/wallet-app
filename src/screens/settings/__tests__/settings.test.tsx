import 'react-native';
import React from 'react';
import { SettingsScreenComponent, IProps, IReduxProps, mockFunction } from '../settings';
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
    setPinLogin: jest.fn()
};
beforeEach(() => {
    // @ts-ignore
    props.mock.mockClear();
});

describe('settings screen component', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    // test mock function
    expect(mockFunction()).toEqual({ type: 'dummy' });

    const wrapper = shallow(<SettingsScreenComponent {...props} />);

    it('renders correctly', () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('Pin login switch tapped', () => {
        wrapper.find('[testID="pin-login"]').simulate('valueChange');
        expect(props.setPinLogin).toHaveBeenCalledTimes(1);
    });
    it('Touch id switch tapped', () => {
        wrapper.find('[testID="touch-id"]').simulate('valueChange');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Backup Wallet', () => {
        wrapper.find('[testID="backup-wallet"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Manage Wallet', () => {
        wrapper.find('[testID="manage-wallet"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Default currency', () => {
        wrapper.find('[testID="default-currency"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Blockchain portfolio', () => {
        wrapper.find('[testID="blockchain-portfolio"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Report issue', () => {
        wrapper.find('[testID="report-issue"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Terms & conditions', () => {
        wrapper.find('[testID="terms-conditions"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
});
