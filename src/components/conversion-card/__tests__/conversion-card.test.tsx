import 'react-native';
import React from 'react';
import { ConversionCardComponent, IProps, IReduxProps } from '../conversion-card';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps & IReduxProps = {
    fromCurrency: 'ZIL',
    toCurrency: 'ETH',
    change: {
        ZIL: {
            ETH: 0.0216
        }
    },
    styles: styleProvider(darkTheme)
};

describe('conversion card component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<ConversionCardComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('renders correctly negative values', () => {
        const wrapper = shallow(
            <ConversionCardComponent
                {...props}
                change={{
                    ZIL: {
                        ETH: -0.0216
                    }
                }}
            />
        );
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
