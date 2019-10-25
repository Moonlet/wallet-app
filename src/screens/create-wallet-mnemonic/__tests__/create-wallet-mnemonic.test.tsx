import React from 'react';
import {
    CreateWalletMnemonicScreenComponent,
    IProps,
    navigationOptions
} from '../create-wallet-mnemonic';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme)
};

describe('creat wallet terms screen component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<CreateWalletMnemonicScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('navigates to next screen', () => {
        const wrapper = shallow(<CreateWalletMnemonicScreenComponent {...props} />);
        wrapper.find('[testID="button-next"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledTimes(1);
    });

    it('sets correct navigation options', () => {
        const navigationProp = { navigation: { state: { params: { goBack: jest.fn() } } } };
        const options = navigationOptions(navigationProp);
        expect(options).toMatchSnapshot();
    });
});
