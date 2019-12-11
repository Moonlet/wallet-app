import React from 'react';
import { OnboardingScreenComponent, IProps } from '../onboarding';
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

describe('creat wallet terms screen component', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });
    it('renders correctly', () => {
        const wrapper = shallow(<OnboardingScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('navigates to create screen', () => {
        const wrapper = shallow(<OnboardingScreenComponent {...props} />);
        wrapper.find('[testID="button-create"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith(
            'CreateWalletNavigation',
            {},
            'navigate-action'
        );
    });
});
