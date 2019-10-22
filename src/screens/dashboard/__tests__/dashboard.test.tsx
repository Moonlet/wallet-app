import React from 'react';
import { Dimensions } from 'react-native';
import { DashboardScreenComponent, IProps, IReduxProps } from '../dashboard';
import { WalletType } from '../../../core/wallet/types';
import { Blockchain } from '../../../core/blockchain/types';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    wallet: {
        id: 'walletId',
        type: WalletType.HD,
        accounts: [
            {
                index: 1,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 12332
            },
            {
                index: 2,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 3432
            },
            {
                index: 8,
                blockchain: Blockchain.ETHEREUM,
                address: '0xeAE3Dcc2E37AD412312ASds2d4a6065A831eF89E',
                publicKey: '1',
                balance: 3.5
            },
            {
                index: 9,
                blockchain: Blockchain.COSMOS,
                address: 'cosmos123ksdadasda',
                publicKey: '1',
                balance: 220
            },
            {
                index: 8,
                blockchain: Blockchain.STELLAR,
                address: 'STLsadlij23lj313',
                publicKey: '1',
                balance: 1234
            }
        ]
    },
    styles: styleProvider(darkTheme),
    theme: darkTheme
};

jest.useFakeTimers();

describe('dashboard screen component', () => {
    beforeAll(() => {
        jest.mock('react-native/Libraries/Animated/src/Animated.js', () => {
            const ActualAnimated = jest.requireActual(
                'react-native/Libraries/Animated/src/Animated.js'
            );
            return {
                ...ActualAnimated,
                timing: (value: any, config: any) => {
                    return {
                        start: (callback: any) => {
                            value.setValue(config.toValue);
                            callback && callback();
                        }
                    };
                }
            };
        });
    });

    it('renders correctly', () => {
        const wrapper = shallow(<DashboardScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('handles scroll correctly', () => {
        const screenWidth = Dimensions.get('window').width;
        const spySetState = jest.spyOn(DashboardScreenComponent.prototype, 'setState');

        const wrapper = shallow(<DashboardScreenComponent {...props} />);
        const instance = wrapper.instance();
        // @ts-ignore
        instance.handleScrollEnd({ nativeEvent: { contentOffset: { x: 0 } } });

        // dont call set state when its the same coin index
        expect(spySetState).not.toHaveBeenCalled();

        // @ts-ignore
        instance.handleScrollEnd({
            nativeEvent: { contentOffset: { x: Math.round(screenWidth * 0.5) } }
        });
        expect(spySetState).toHaveBeenCalledWith({
            coinIndex: 1
        });
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('swtiches to correct coin on press', () => {
        const wrapper = shallow(<DashboardScreenComponent {...props} />);
        const selectionButton = wrapper.find('[testID="blockchainSelector"]').childAt(2);
        selectionButton.simulate('press');
        // @ts-ignore
        expect(wrapper.state().coinIndex).toBe(2);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
