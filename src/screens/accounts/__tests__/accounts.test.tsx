import React from 'react';
import { shallow } from 'enzyme';
import { AccountsScreenComponent, IProps, IReduxProps, INavigationParams } from '../accounts';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';
import { WalletType } from '../../../core/wallet/types';
import { IThemeProps } from '../../../core/theme/with-theme';
import { Blockchain } from '../../../core/blockchain/types';
import { INavigationProps } from '../../../navigation/with-navigation-params';

const props: IReduxProps &
    INavigationProps<INavigationParams> &
    IThemeProps<ReturnType<typeof stylesProvider>> = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    blockchain: Blockchain.ETHEREUM,
    styles: stylesProvider(darkTheme),
    wallet: {
        id: 'walletId',
        type: WalletType.HD,
        name: 'some',
        accounts: []
    },
    addAccount: jest.fn(),
    removeAccount: jest.fn()
};

export default describe('Accounts screen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    test('renders correctly', () => {
        const wrapper = shallow(<AccountsScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
