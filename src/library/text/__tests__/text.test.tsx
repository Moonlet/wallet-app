import React from 'react';
import { TextComponent, ITextProps } from '../text';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: ITextProps = {
    styles: styleProvider(darkTheme)
};

describe('text library components', () => {
    it('renders correctly regular text', () => {
        const wrapper = shallow(<TextComponent {...props}>dummy</TextComponent>);
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('renders correctly formatted text', () => {
        const wrapper = shallow(
            <TextComponent {...props} format={{ maximumFractionDigits: 3 }}>
                100.133333333
            </TextComponent>
        );
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('renders correctly small text', () => {
        const wrapper = shallow(
            <TextComponent {...props} small>
                test
            </TextComponent>
        );
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('renders correctly text with style provided via prop', () => {
        const wrapper = shallow(
            <TextComponent {...props} style={{ fontSize: 34 }}>
                test
            </TextComponent>
        );
        expect(wrapper.debug()).toMatchSnapshot();
    });
    it('renders correctly text with multiple styles', () => {
        const wrapper = shallow(
            <TextComponent {...props} style={[{ fontSize: 34 }, { color: 'red' }]}>
                test
            </TextComponent>
        );
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
