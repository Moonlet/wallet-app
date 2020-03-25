import React from 'react';
import { shallow } from 'enzyme';
import { WalletsScreenComponent, IProps, IReduxProps } from '../wallets';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';
import { WalletType } from '../../../core/wallet/types';
import { IThemeProps } from '../../../core/theme/with-theme';

jest.mock('../../../redux/config');

const props: IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>> = {
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
                name: 'some',
                accounts: []
            }
        ],
        [WalletType.HW]: []
    },
    selectedWallet: {
        id: 'walletId',
        type: WalletType.HD
    },
    theme: darkTheme,
    hints: {
        WALLETS_SCREEN: {
            WALLETS_LIST: 0
        }
    },
    showHint: jest.fn().mockImplementation()
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
