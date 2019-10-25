import React from 'react';
import {
    CreateWalletTermsScreenComponent,
    IProps,
    navigationOptions
} from '../create-wallet-terms';
import { darkTheme } from '../../../styles/themes/dark-theme';
import styleProvider from '../styles';

import { shallow } from 'enzyme';

const props: IProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: styleProvider(darkTheme)
};

describe('creat wallet terms screen component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<CreateWalletTermsScreenComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('navigates to next screen', () => {
        const wrapper = shallow(<CreateWalletTermsScreenComponent {...props} />);
        wrapper.find('[testID="button-accept"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledTimes(1);
    });

    it('sets correct navigation options', () => {
        const navigationProp = { navigation: { state: { params: { goBack: jest.fn() } } } };
        const options = navigationOptions(navigationProp);
        expect(options).toMatchSnapshot();
        expect(options.headerLeft()).toMatchSnapshot();
    });

    it('does not have a back button if no goBack param is set', () => {
        const navigationProp = { navigation: {} };
        const options = navigationOptions(navigationProp);
        expect(options.headerLeft()).toBe(null);
    });
});
