import React from 'react';
import { SetPasswordScreenComponent, IProps } from '../set-password';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme),
    theme: darkTheme
};

describe('set password screen component', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    it('renders correctly', () => {
        const wrapper = shallow(<SetPasswordScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('sets password correctly', () => {
        const wrapper = shallow(<SetPasswordScreenComponent {...props} />);

        wrapper.find('[testID="input-password"]').simulate('changeText', 'pass1');
        wrapper.find('[testID="input-confirm-password"]').simulate('changeText', 'pass1');
        wrapper.find('[testID="reveal-password"]').simulate('press');
        wrapper.find('[testID="reveal-confirm-password"]').simulate('press');

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
