import React from 'react';
import {
    CreateWalletMnemonicScreenComponent,
    IProps,
    navigationOptions
} from '../create-wallet-mnemonic';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { Mnemonic } from '../../../core/wallet/hd-wallet/mnemonic';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme)
};

jest.mock('../../../core/wallet/hd-wallet/mnemonic');

describe('creat wallet terms screen component', () => {
    beforeAll(() => {
        Mnemonic.generate = jest.fn(
            () => '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24'
        );
    });

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
