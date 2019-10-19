import 'react-native';
import React from 'react';
import { CoinDashboardComponent, IProps } from '../coin-dashboard';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { Blockchain } from '../../../core/blockchain/types';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps = {
    accounts: [
        {
            index: 1,
            blockchain: Blockchain.ZILLIQA,
            address: 'zil1vs74hw5k21233h432kj321l3k21b',
            publicKey: '1',
            balance: 12332
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
});
