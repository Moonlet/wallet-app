import 'react-native';
import React from 'react';
import { CoinBalanceCardComponent, IProps } from '../coin-balance-card';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../core/blockchain/types';

const props: IProps = {
    currency: 'ZIL',
    balance: new BigNumber(100),
    blockchain: Blockchain.ZILLIQA,
    toCurrency: 'ETH',
    width: 100,
    active: true,
    styles: styleProvider(darkTheme),
    selectedAccount: {
        index: 1,
        blockchain: Blockchain.ZILLIQA,
        address: 'zil1vs74hw5k21233h432kj321l3k21b',
        publicKey: '1',
        balance: {
            value: new BigNumber(12332),
            inProgress: false,
            timestamp: 123,
            error: undefined
        },
        tokens: {}
    }
};

describe('coin balance component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<CoinBalanceCardComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
