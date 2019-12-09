import React from 'react';
import {
    CreateWalletMnemonicScreenComponent,
    IProps,
    navigationOptions,
    IReduxProps
} from '../create-wallet-mnemonic';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';
import { Mnemonic } from '../../../core/wallet/hd-wallet/mnemonic';
import { timeUtils } from '../../../core/utils/time';

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme),
    tosVersion: 1
};

jest.mock('../../../core/wallet/hd-wallet/mnemonic');
jest.mock('../../../core/constants/app', () => {
    return {
        TOS_VERSION: 1
    };
});

describe('creat wallet terms screen component', () => {
    beforeAll(async () => {
        Mnemonic.generate = jest.fn(() =>
            Promise.resolve('1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24')
        );

        await loadTranslations('en');
    });

    it('renders correctly', async () => {
        const wrapper = shallow(<CreateWalletMnemonicScreenComponent {...props} />);
        await timeUtils.delay();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('navigates to next screen', () => {
        const wrapper = shallow(<CreateWalletMnemonicScreenComponent {...props} />);
        wrapper.find('[testID="button-next"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledTimes(1);
    });

    it('sets correct navigation options', () => {
        const navigationProp = { navigation: { state: { params: { goBack: jest.fn() } } } };
        const options = navigationOptions(navigationProp);
        expect(options.headerLeft()).toMatchSnapshot();
        expect(options).toMatchSnapshot();
    });

    it('does not have a back button if no goBack param is set', () => {
        const navigationProp = { navigation: {} };
        const options = navigationOptions(navigationProp);
        expect(options.headerLeft()).toBe(null);
    });

    it('navigates to tos when there are new tos', () => {
        shallow(<CreateWalletMnemonicScreenComponent {...{ ...props, tosVersion: 0 }} />);
        expect(props.navigation.navigate).toHaveBeenCalledWith('CreateWalletTerms');
    });
});
