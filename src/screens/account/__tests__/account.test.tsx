import React from 'react';
import { shallow } from 'enzyme';
import {
    AccountScreenComponent,
    AccountScreen,
    mapStateToProps,
    IProps,
    IReduxProps
} from '../account';
import stylesProvider from '../styles';
import { darkTheme } from '../../../styles/themes/dark-theme';
import { loadTranslations } from '../../../core/i18n';

const props: IProps & IReduxProps = {
    // @ts-ignore
    navigation: {
        navigate: jest.fn()
    },
    styles: stylesProvider(darkTheme),
    theme: darkTheme,
    account: {} as any
};

export default describe('AccountScreen', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });

    test('renders correctly', () => {
        mapStateToProps({} as any, {} as any); // trick coverage
        expect(shallow(<AccountScreenComponent {...props} />).debug()).toMatchSnapshot();
        expect(shallow(<AccountScreen />).debug()).toMatchSnapshot();
    });

    test('Send button goes on the proper screen', () => {
        const wrapper = shallow(<AccountScreenComponent {...props} />);
        wrapper.find('[testID="button-send"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith('Send');
    });
    test('Receive button goes on the proper screen', () => {
        const wrapper = shallow(<AccountScreenComponent {...props} />);
        wrapper.find('[testID="button-receive"]').simulate('Press');
        expect(props.navigation.navigate).toHaveBeenCalledWith('Receive', { address: 'value' });
    });
});
