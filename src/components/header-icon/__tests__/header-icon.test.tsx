import React from 'react';
import { HeaderIconComponent, IProps } from '../header-icon';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';

const props: IProps = {
    styles: styleProvider(darkTheme)
};

describe('header go back button', () => {
    beforeAll(async () => loadTranslations('en'));

    it('renders correctly', () => {
        const wrapper = shallow(<HeaderIconComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
