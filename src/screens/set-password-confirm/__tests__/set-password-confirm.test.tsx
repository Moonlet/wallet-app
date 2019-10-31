import React from 'react';
import { SetPasswordConfirmScreenComponent, IProps } from '../set-password-confirm';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme)
};

describe('set password confirm screen component', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    it('renders correctly', () => {
        const wrapper = shallow(<SetPasswordConfirmScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('navigates correctly', () => {
        const wrapper = shallow(<SetPasswordConfirmScreenComponent {...props} />);

        wrapper.find('[testID="button-understand"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith('SetPassword');
    });
});
