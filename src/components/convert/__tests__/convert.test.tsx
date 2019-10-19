import 'react-native';
import React from 'react';
import { ConvertComponent, IProps, IReduxProps } from '../convert';

import { shallow } from 'enzyme';

const props: IProps & IReduxProps = {
    amount: 100,
    from: 'ETH',
    to: 'ZIL',
    usdPrices: {
        ETH: 182.25,
        ZIL: 0.005821
    },
    displayCurrency: true
};

describe('convert component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<ConvertComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('doesnt throw when props missing', () => {
        // @ts-ignore
        const wrapper = shallow(<ConvertComponent usdPrices={[]} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
