import 'react-native';
import React from 'react';
import { ConversionCardComponent, IProps, IReduxProps } from '../conversion-card';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { IThemeProps } from '../../../core/theme/with-theme';
import { Blockchain } from '../../../core/blockchain/types';

const props: IProps & IReduxProps & IThemeProps<ReturnType<typeof styleProvider>> = {
    fromCurrency: 'ZIL',
    toCurrency: 'ETH',
    change: {
        ZIL: {
            ETH: 0.0216
        }
    },
    styles: styleProvider(darkTheme),
    blockchain: Blockchain.ETHEREUM
};

describe('conversion card component', () => {
    it('renders correctly', () => {
        //        const wrapper = shallow(<ConversionCardComponent {...props} />);
        expect('conversion card').toMatchSnapshot();
    });
});
