import React from 'react';
import { shallow } from 'enzyme';
import { SendScreenComponent, IProps } from '../send';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: stylesProvider(darkTheme),
    theme: darkTheme
};

export default describe('SendScreen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    test('renders correctly', () => {
        const wrapper = shallow(<SendScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();

        wrapper.setState({
            isValidAddress: true,
            amount: '1'
        });
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('renders correctly - no amount and fee should be present', () => {
        const wrapper = shallow(<SendScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('Confirm button goes on the proper screen', () => {
        const wrapper = shallow(<SendScreenComponent {...props} />);
        wrapper.setState({
            isValidAddress: true,
            amount: '1'
        });

        wrapper.find('[testID="confirm-payment"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith('ConfirmPayment');
    });

    test('Button should be disabled if amount is 0', () => {
        const wrapper = shallow(<SendScreenComponent {...props} />);
        wrapper.setState({
            isValidAddress: true
        });
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('should change state if address is entered', () => {
        const wrapper: any = shallow(<SendScreenComponent {...props} />).instance();
        wrapper.verifyAddress('address');
        expect(wrapper.state.address).toEqual('address');
    });
    test('should change state if amount is entered', () => {
        const wrapper: any = shallow(<SendScreenComponent {...props} />).instance();
        wrapper.addAmount('1');
        expect(wrapper.state.amount).toEqual('1');
    });
    test('should calculate fee is amount is entered', () => {
        const wrapper: any = shallow(<SendScreenComponent {...props} />).instance();
        wrapper.addAmount('1');
        expect(wrapper.state.fee).toEqual('0.001ZIL');
    });
});
