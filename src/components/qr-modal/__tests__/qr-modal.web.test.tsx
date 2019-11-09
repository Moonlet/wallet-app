import React from 'react';
import { QrModalReaderComponent } from '../qr-modal.web';

import { shallow } from 'enzyme';

describe('qr code modal web', () => {
    test('renders correctly', () => {
        const wrapper = shallow(<QrModalReaderComponent />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
