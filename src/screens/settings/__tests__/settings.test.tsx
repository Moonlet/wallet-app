import 'react-native';
import React from 'react';
import { SettingsScreenComponent, IProps, IReduxProps } from '../settings';
import { shallow } from 'enzyme';
import styleProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme),
    theme: darkTheme,
    mock: jest.fn()
};

describe('settings screen component', () => {
    const wrapper = shallow(<SettingsScreenComponent {...props} />);

    it('renders correctly', () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('Pin login switch tapped', () => {
        wrapper.find('[testID="pin-login"]').simulate('valueChange');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Touch id switch tapped', () => {
        wrapper.find('[testID="touch-id"]').simulate('valueChange');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Secret phrase', () => {
        wrapper.find('[testID="secret-phrase"]').simulate('Press');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Backup Wallet', () => {
        wrapper.find('[testID="backup-wallet"]').simulate('Press');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Manage Wallet', () => {
        wrapper.find('[testID="manage-wallet"]').simulate('Press');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Default currency', () => {
        wrapper.find('[testID="default-currency"]').simulate('Press');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Default network', () => {
        wrapper.find('[testID="default-network"]').simulate('Press');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Report issue', () => {
        wrapper.find('[testID="report-issue"]').simulate('Press');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Developer options', () => {
        wrapper.find('[testID="developer-options"]').simulate('Press');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Terms & conditions', () => {
        wrapper.find('[testID="terms-conditions"]').simulate('Press');
        expect(props.mock).toHaveBeenCalled();
    });
});
