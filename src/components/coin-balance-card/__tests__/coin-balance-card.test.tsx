import 'react-native';
import React from 'react';
import { CoinBalanceCardComponent, IProps } from '../coin-balance-card';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import BigNumber from 'bignumber.js';

const props: IProps = {
    currency: 'ZIL',
    balance: new BigNumber(100),
    toCurrency: 'ETH',
    width: 100,
    active: true,
    styles: styleProvider(darkTheme)
};

describe('coin balance component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<CoinBalanceCardComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
