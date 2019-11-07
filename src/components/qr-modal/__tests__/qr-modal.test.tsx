import React from 'react';
import { QrModalReaderComponent, IProps } from '../qr-modal';
import { loadTranslations } from '../../../core/i18n';

import { shallow } from 'enzyme';

const props: IProps = {
    onQrCodeScanned: jest.fn()
};

jest.mock('react-native-camera-kit');

describe('qr code modal ', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });
    test('renders correctly', () => {
        const wrapper = shallow(<QrModalReaderComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
