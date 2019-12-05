import React from 'react';
import { TermsConditionsScreenComponent, IProps } from '../terms-conditions';
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

describe('terms and conditions screen component', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    it('renders correctly', () => {
        const wrapper = shallow(<TermsConditionsScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
