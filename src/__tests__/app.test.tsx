import 'react-native';
import React from 'react';
import App from '../app';

// Note: test renderer must be required after react-native.
import { shallow } from 'enzyme';

test('renders correctly', () => {
    shallow(<App />);
});
