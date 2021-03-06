import React from 'react';
import { PrivacyPolicyScreenComponent, IProps } from '../privacy-policy';
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

describe('privacy policy screen component', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    it('renders correctly', () => {
        const wrapper = shallow(<PrivacyPolicyScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
