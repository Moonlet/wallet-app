import React from 'react';
import { shallow } from 'enzyme';
import { ReceiveScreenComponent, IProps } from '../receive';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn(),
        state: {
            params: {
                token: {}
            }
        }
    },
    styles: stylesProvider(darkTheme),
    theme: darkTheme,
    account: { address: 'value' }
};

export default describe('SendScreen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    test('renders correctly', () => {
        const wrapper = shallow(<ReceiveScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('renders correctly - button should show Copied in title', () => {
        const wrapper = shallow(<ReceiveScreenComponent {...props} />);

        wrapper.find('[testID="copy-clipboard"]').simulate('Press');
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
