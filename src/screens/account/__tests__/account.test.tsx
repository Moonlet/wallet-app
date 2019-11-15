import React from 'react';
import { shallow } from 'enzyme';
import {
    AccountScreenComponent,
    AccountScreen,
    mapStateToProps,
    IProps,
    IReduxProps
} from '../account';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../core/blockchain/types';

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn(),
        setParams: jest.fn()
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
    }
};

export default describe('AccountScreen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    test('renders correctly', () => {
        mapStateToProps({} as any, {} as any); // trick coverage
        expect(shallow(<AccountScreenComponent {...props} />).debug()).toMatchSnapshot();
        expect(shallow(<AccountScreen />).debug()).toMatchSnapshot();
    });

    test('Send button goes on the proper screen', () => {
        const wrapper = shallow(<AccountScreenComponent {...props} />);
        wrapper.find('[testID="button-send"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith('Send', { accountIndex: 1 });
    });
    test('Receive button goes on the proper screen', () => {
        const wrapper = shallow(<AccountScreenComponent {...props} />);
        wrapper.find('[testID="button-receive"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith('Receive', { accountIndex: 1 });
    });
});
