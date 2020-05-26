import React from 'react';
import { HeaderLeftComponent, IProps } from '../header-left';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';
import { loadTranslations } from '../../../core/i18n';
import { IconValues } from '../../icon/values';

const props: IProps = {
    styles: styleProvider(darkTheme),
    icon: IconValues.SETTINGS,
    text: 'text',
    onPress: jest.fn()
};

describe('header go back button', () => {
    beforeAll(async () => loadTranslations('en'));

    it('renders correctly', () => {
        const wrapper = shallow(<HeaderLeftComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
