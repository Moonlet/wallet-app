import 'react-native';
import { IProps } from '../token-dashboard';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { Blockchain } from '../../../core/blockchain/types';
import styleProvider from '../styles';
import BigNumber from 'bignumber.js';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    accounts: [
        {
            index: 1,
            blockchain: Blockchain.ZILLIQA,
            address: 'zil1vs74hw5k21233h432kj321l3k21b',
            publicKey: '1',
            balance: {
                value: new BigNumber(12332),
                inProgress: false,
                timestamp: 123,
                error: undefined
            }
        }
    ],
    blockchain: Blockchain.ZILLIQA,
    styles: styleProvider(darkTheme)
};

describe('coin dashboard component', () => {
    it('renders correctly', () => {
        // const wrapper = shallow(<TokenDashboardComponent {...props} />);
        // expect(wrapper.debug()).toMatchSnapshot();
    });
});
