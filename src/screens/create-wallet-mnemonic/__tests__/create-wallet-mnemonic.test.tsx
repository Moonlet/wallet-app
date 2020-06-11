import React from 'react';
import { CreateWalletMnemonicScreenComponent, IProps } from '../create-wallet-mnemonic';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';
import { Mnemonic } from '../../../core/wallet/hd-wallet/mnemonic';
import { delay } from '../../../core/utils/time';

const props: IProps = {
    // @ts-ignore
    navigation: {
        dispatch: jest.fn(),
        navigate: jest.fn(),
        state: {
            params: {
                step: 1,
                mnemonic: undefined
            }
        }
    },
    styles: styleProvider(darkTheme),
    step: 1
};

jest.mock('../../../core/wallet/hd-wallet/mnemonic');

describe('creat wallet terms screen component', () => {
    beforeAll(async () => {
        Mnemonic.generate = jest.fn(() => Promise.resolve('1 2 3 4 5 6 7 8 9 10 11 12'));

        await loadTranslations('en');
    });

    it('renders correctly', async () => {
        const wrapper = shallow(<CreateWalletMnemonicScreenComponent {...props} />);
        await delay();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('navigates to CreateWalletConfirmMnemonic screen', () => {
        const wrapper = shallow(<CreateWalletMnemonicScreenComponent {...props} />);
        wrapper.find('[testID="next-button-1"]').simulate('Press');
        expect(props.navigation.dispatch).toHaveBeenCalledTimes(1);
    });
});
