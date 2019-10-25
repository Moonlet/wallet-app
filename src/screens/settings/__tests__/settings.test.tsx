import 'react-native';
import React from 'react';
import { SettingsScreenComponent, IProps, IReduxProps, mockFunction } from '../settings';
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
beforeEach(() => {
    // @ts-ignore
    props.mock.mockClear();
});

describe('settings screen component', () => {
    // test mock function
    expect(mockFunction()).toEqual({ type: 'dummy' });

    const wrapper = shallow(<SettingsScreenComponent {...props} />);

    it('renders correctly', () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('Pin login switch tapped', () => {
        wrapper.find('[testID="pin-login"]').simulate('valueChange');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Touch id switch tapped', () => {
        wrapper.find('[testID="touch-id"]').simulate('valueChange');
        expect(props.mock).toHaveBeenCalled();
    });
    it('Secret phrase', () => {
        wrapper.find('[testID="secret-phrase"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
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
    it('Default network', () => {
        wrapper.find('[testID="default-network"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Report issue', () => {
        wrapper.find('[testID="report-issue"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Developer options', () => {
        wrapper.find('[testID="developer-options"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
    it('Terms & conditions', () => {
        wrapper.find('[testID="terms-conditions"]').simulate('Press');
        expect(props.mock).toHaveBeenCalledTimes(1);
    });
});
