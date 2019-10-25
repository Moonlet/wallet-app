import 'react-native';
import React from 'react';
import { AccountCardComponent, IProps } from '../account-card';
import { Blockchain } from '../../../core/blockchain/types';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    account: {
        index: 1,
        blockchain: Blockchain.ZILLIQA,
        address: 'zil1vs74hw5k21233h432kj321l3k21b',
        publicKey: '1',
        balance: 12332
    },
    blockchain: Blockchain.ZILLIQA,
    styles: styleProvider(darkTheme)
};
describe('account card component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<AccountCardComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('handles card press properly', () => {
        const wrapper = shallow(<AccountCardComponent {...props} />);
        wrapper.find('[testID="account-card"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith('Account');
    });
});
