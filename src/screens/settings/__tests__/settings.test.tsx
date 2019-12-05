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

export default describe('Wallet screen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    it('renders correctly', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('Pin login switch tapped', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        wrapper.find('[testID="pin-login"]').simulate('valueChange');
        expect(props.setPinLogin).toHaveBeenCalledTimes(1);
    });
    it('Touch id switch tapped', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        wrapper.find('[testID="touch-id"]').simulate('valueChange');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Backup Wallet', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        wrapper.find('[testID="backup-wallet"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Blockchain portfolio', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        wrapper.find('[testID="blockchain-portfolio"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Report issue', () => {
        const wrapper = shallow(<SettingsScreenComponent {...props} />);
        wrapper.find('[testID="report-issue"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
});
