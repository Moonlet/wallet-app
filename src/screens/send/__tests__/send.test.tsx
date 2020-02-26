import React from 'react';
import { shallow } from 'enzyme';
import { SendScreenComponent, IProps, navigationOptions } from '../send';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../core/blockchain/types';

jest.mock('../../../redux/config');

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: stylesProvider(darkTheme),
    theme: darkTheme,
    account: {
        index: 1,
        blockchain: Blockchain.ZILLIQA,
        address: 'zil1vs74hw5k21233h432kj321l3k21b',
        publicKey: '1',
        balance: {
            inProgress: false,
            timestamp: 123,
            value: new BigNumber(12332)
        }
    },
    blockchain: Blockchain.ZILLIQA,
    contacts: {},
    token: {}
};

export default describe('SendScreen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    // test('renders correctly', () => {
    //     const wrapper = shallow(<SendScreenComponent {...props} />);
    //     expect(wrapper.debug()).toMatchSnapshot();

    //     wrapper.setState({
    //         isValidAddress: true,
    //         amount: '1'
    //     });
    //     expect(wrapper.debug()).toMatchSnapshot();
    // });

    // test('renders correctly - no amount and fee should be present', () => {
    //     const wrapper = shallow(<SendScreenComponent {...props} />);
    //     expect(wrapper.debug()).toMatchSnapshot();
    //     expect(wrapper.debug()).toMatchSnapshot();
    // });

    // test('Confirm button goes on the proper screen', () => {
    //     const wrapper = shallow(<SendScreenComponent {...props} />);
    //     wrapper.setState({
    //         isValidAddress: true,
    //         amount: '1'
    //     });

    //     wrapper.find('[testID="confirm-payment"]').simulate('Press');
    //     expect(props.navigation.navigate).toHaveBeenCalledWith('ConfirmPayment');
    // });

    // test('Button should be disabled if amount is 0', () => {
    //     const wrapper = shallow(<SendScreenComponent {...props} />);
    //     wrapper.setState({
    //         isValidAddress: true
    //     });
    //     expect(wrapper.debug()).toMatchSnapshot();
    // });
    test('Buton should open qr-code', () => {
        const wrapper = shallow(<SendScreenComponent {...props} />);

        wrapper.find('[testID="qrcode-icon"]').simulate('Press');
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('should change state if address is entered', () => {
        const wrapper: any = shallow(<SendScreenComponent {...props} />).instance();
        wrapper.verifyInputText('address');
        expect(wrapper.state.toAddress).toEqual('address');
    });
    // test('should change state if amount is entered', () => {
    //     const wrapper: any = shallow(<SendScreenComponent {...props} />).instance();
    //     wrapper.addAmount('1');
    //     expect(wrapper.state.amount).toEqual('1');
    // });
    // test('should calculate fee is amount is entered', () => {
    //     const wrapper: any = shallow(<SendScreenComponent {...props} />).instance();
    //     wrapper.addAmount('1');
    //     expect(wrapper.state.fee).toEqual('0.001ZIL');
    // });
    test('should Call verify address', () => {
        const wrapper: any = shallow(<SendScreenComponent {...props} />);
        wrapper.instance().onQrCodeScanned('address');
        expect(wrapper.debug()).toMatchSnapshot();
    });

    // test('onChangeText', () => {
    //     const wrapper: any = shallow(<SendScreenComponent {...props} />);
    //     wrapper.find('[testID="input-address"]').simulate('changeText', 'pass1');
    //     expect(wrapper.debug()).toMatchSnapshot();

    //     wrapper.setState({
    //         isValidAddress: true,
    //         feeOptions: {
    //             feeTotal: new BigNumber(1)
    //         }
    //     });
    //     wrapper.find('[testID="amount"]').simulate('changeText', '10');

    //     expect(wrapper.debug()).toMatchSnapshot();
    // });

    // test('sets correct navigation options', () => {
    //     const navigationProp = {
    //         navigation: { state: { params: { goBack: jest.fn() } } }
    //     };
    //     const options = navigationOptions(navigationProp);
    //     expect(options).toMatchSnapshot();
    // });
});
