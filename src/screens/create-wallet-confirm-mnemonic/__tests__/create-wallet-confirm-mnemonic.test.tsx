import React from 'react';
import {
    CreateWalletConfirmMnemonicScreenComponent,
    IProps
} from '../create-wallet-confirm-mnemonic';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';

const props: IProps = {
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
    theme: darkTheme
};

let randResonse = 0.1;
const mathBackup = global.Math;

describe('creat wallet terms screen component', () => {
    beforeAll(async () => {
        const mockMath = Object.create(global.Math);
        mockMath.random = () => {
            randResonse += 0.1;
            return randResonse;
        };
        global.Math = mockMath;
        await loadTranslations('en');
    });

    afterAll(() => {
        global.Math = mathBackup;
    });

    it('renders correctly', () => {
        const wrapper = shallow(<CreateWalletConfirmMnemonicScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
