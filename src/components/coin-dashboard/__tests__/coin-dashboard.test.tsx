import 'react-native';
import React from 'react';
import { CoinDashboardComponent, IProps } from '../coin-dashboard';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { Blockchain } from '../../../core/blockchain/types';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import BigNumber from 'bignumber.js';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    accounts: [
        {
            index: 1,
            blockchain: Blockchain.ZILLIQA,
            address: 'zil1vs74hw5k21233h432kj321l3k21b',
            publicKey: '1',
            balance: {
                value: new BigNumber(12332),
                inProgress: false,
                timestamp: 123
            }
        }
    ],
    blockchain: Blockchain.ZILLIQA,
    styles: styleProvider(darkTheme)
};

describe('coin dashboard component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<CoinDashboardComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('navigates to create new wallet', () => {
        const wrapper = shallow(<CoinDashboardComponent {...props} />);
        wrapper.find('[testID="button-create-wallet"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith(
            'CreateWalletNavigation',
            {},
            'navigate-action'
        );
    });
});
