import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

// Mocks
jest.mock('react-navigation', () => {
    return {
        createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {
            return null;
        })
    };
});

jest.mock('react-navigation-tabs', () => {
    return {
        createBottomTabNavigator: jest.fn()
    };
});
