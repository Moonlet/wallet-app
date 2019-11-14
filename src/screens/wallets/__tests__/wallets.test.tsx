import React from 'react';
import { shallow } from 'enzyme';
import { WalletsScreenComponent, IProps, navigationOptions, IReduxProps } from '../wallets';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';
import { WalletType } from '../../../core/wallet/types';

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: stylesProvider(darkTheme),
    wallets: {
        [WalletType.HD]: [
            {
                id: 'walletId',
                type: WalletType.HD,
                accounts: []
            }
        ],
        [WalletType.HW_LEDGER]: []
    },
    theme: darkTheme
};

export default describe('Wallet screen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    test('renders correctly', () => {
        const wrapper = shallow(<WalletsScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
