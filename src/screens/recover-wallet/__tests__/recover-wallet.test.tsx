import React from 'react';
import {
    RecoverWalletScreenComponent,
    IProps,
    navigationOptions,
    IReduxProps
} from '../recover-wallet';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';
import { Mnemonic } from '../../../core/wallet/hd-wallet/mnemonic';
import { testUtils } from '../../../core/utils/test';

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme),
    tosVersion: 1,
    createHDWallet: jest.fn((mnemonic, callback): any => callback()),
    theme: darkTheme
};

jest.mock('../../../core/wallet/hd-wallet/mnemonic');
jest.mock('../../../core/constants/app', () => {
    return {
        TOS_VERSION: 1
    };
});

const validMnemonic =
    'panic club above clarify orbit resist illegal feel bus remember aspect field test bubble dog trap awesome hand room rice heavy idle faint salmon';

describe('creat wallet terms screen component', () => {
    beforeAll(async () => {
        // Mnemonic.generate = jest.fn(() =>
        //     Promise.resolve('1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24')
        // );

        await loadTranslations('en');
    });

    test('renders correctly', async () => {
        const wrapper = shallow(<RecoverWalletScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('navigates to tos when there are new tos', () => {
        const wrapper = shallow(<RecoverWalletScreenComponent {...{ ...props, tosVersion: 0 }} />);
        expect(props.navigation.navigate).toHaveBeenCalledWith('CreateWalletTerms');
    });

    test('sets correct navigation options', () => {
        const navigationProp = { navigation: { state: { params: { goBack: jest.fn() } } } };
        const options = navigationOptions(navigationProp);
        expect(options.headerLeft()).toMatchSnapshot();
        expect(options).toMatchSnapshot();
    });

    test('does not have a back button if no goBack param is set', () => {
        const navigationProp = { navigation: {} };
        const options = navigationOptions(navigationProp);
        expect(options.headerLeft()).toBe(null);
    });

    test('fills first input corectly', () => {
        const wrapper = shallow(<RecoverWalletScreenComponent {...props} />);

        // doesnt work
        wrapper.find('[testID="button-next"]').simulate('press');
        wrapper.find('[testID="button-paste"]').simulate('press');
        expect(wrapper).toMatchSnapshot();
    });

    test('generates suggestions correctly and sets correct mnemonic based on suggestion', () => {
        const spySetState = jest.spyOn(RecoverWalletScreenComponent.prototype, 'setState');
        const wrapper = shallow(<RecoverWalletScreenComponent {...props} />);
        const instance = wrapper.instance();

        // @ts-ignore
        instance.setMnemonicText(0, 'pa');
        expect(spySetState).toBeCalledWith({
            indexForSuggestions: 0,
            mnemonic: [
                'pa',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            ],
            suggestions: [
                'pact',
                'paddle',
                'page',
                'pair',
                'palace',
                'palm',
                'panda',
                'panel',
                'panic',
                'panther',
                'paper',
                'parade',
                'parent',
                'park',
                'parrot',
                'party',
                'pass',
                'patch',
                'path',
                'patient',
                'patrol',
                'pattern',
                'pause',
                'pave',
                'payment'
            ]
        });

        wrapper.find('[testID="button-suggestion-0"]').simulate('press');

        expect(spySetState).toBeCalledWith({
            mnemonic: [
                'pact',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            ]
        });
    });

    test('marks errors', () => {
        const wrapper = shallow(<RecoverWalletScreenComponent {...props} />);
        wrapper.find('[testID="button-confirm"]').simulate('press');
        expect(wrapper).toMatchSnapshot();
    });

    test('creates wallet and navigates to dashboard', () => {
        const wrapper = shallow(<RecoverWalletScreenComponent {...props} />);

        Mnemonic.verify = jest.fn().mockReturnValue(true);

        wrapper.setState({ mnemonic: validMnemonic.split(' ') });
        wrapper.find('[testID="button-confirm"]').simulate('press');

        const createWalletSpy = jest.spyOn(props, 'createHDWallet');

        expect(createWalletSpy.mock.calls).toMatchSnapshot();
        expect(props.navigation.navigate).toHaveBeenCalledWith(
            'MainNavigation',
            {},
            'navigate-action'
        );
    });
});
