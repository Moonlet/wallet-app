import React from 'react';
import {
    CreateWalletConfirmMnemonicScreenComponent,
    IProps,
    IReduxProps
} from '../create-wallet-confirm-mnemonic';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';

jest.mock('../../../redux/config');

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn(),
        // @ts-ignore
        state: {
            params: {
                mnemonic: [
                    'panic',
                    'club',
                    'above',
                    'clarify',
                    'orbit',
                    'resist',
                    'illegal',
                    'feel',
                    'bus',
                    'remember',
                    'aspect',
                    'field',
                    'test',
                    'bubble',
                    'dog',
                    'trap',
                    'awesome',
                    'hand',
                    'room',
                    'rice',
                    'heavy',
                    'idle',
                    'faint',
                    'salmon'
                ]
            }
        }
    },
    styles: styleProvider(darkTheme),
    theme: darkTheme,
    createHDWallet: jest.fn()
};

let randResonse = 0;
const mathBackup = global.Math;

describe('creat wallet terms screen component', () => {
    beforeAll(async () => {
        const mockMath = Object.create(global.Math);
        mockMath.random = () => {
            randResonse += 0.03;
            return randResonse;
        };
        global.Math = mockMath;
        await loadTranslations('en');
    });

    beforeEach(() => {
        randResonse = 0;
    });

    afterAll(() => {
        global.Math = mathBackup;
    });

    it('renders correctly', () => {
        const wrapper = shallow(<CreateWalletConfirmMnemonicScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    // it('validates mnemonic words', () => {
    //     const wrapper = shallow(<CreateWalletConfirmMnemonicScreenComponent {...props} />);
    //     wrapper.find('[testID="input-password-0"]').simulate('changeText', 'panic');
    //     wrapper.find('[testID="input-password-1"]').simulate('changeText', 'club');
    //     wrapper.find('[testID="input-password-2"]').simulate('changeText', 'above');

    //     wrapper.find('[testID="button-confirm"]').simulate('press');

    //     expect(wrapper.debug()).toMatchSnapshot();
    // });
});
