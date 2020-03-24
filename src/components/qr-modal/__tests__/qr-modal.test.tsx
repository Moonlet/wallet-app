import React from 'react';
import { QrModalReaderComponent, IProps } from '../qr-modal';
import { loadTranslations } from '../../../core/i18n';
import {
    setCheckDeviceCameraAuthorizationStatusResult,
    CameraKitCamera
} from 'react-native-camera-kit';
import { shallow } from 'enzyme';

const props: IProps = {
    onQrCodeScanned: jest.fn(),
    setDisplayPasswordModal: jest.fn()
};

jest.mock('react-native-camera-kit', () => {
    let checkDeviceCameraAuthorizationStatusResult = Promise.resolve(true);
    return {
        CameraKitCameraScreen: () => null,
        CameraKitCamera: {
            checkDeviceCameraAuthorizationStatus: jest.fn(
                () => checkDeviceCameraAuthorizationStatusResult
            )
        },
        setCheckDeviceCameraAuthorizationStatusResult: res =>
            (checkDeviceCameraAuthorizationStatusResult = res)
    };
});

jest.mock('../../../core/utils/request-permissions', () => ({
    checkDeviceCameraPermission: jest.fn().mockResolvedValue(value => Promise.resolve(value))
}));

describe('qr code modal ', () => {
    beforeAll(async () => {
        await loadTranslations('en');
    });
    test('renders correctly', async () => {
        const wrapper = shallow(<QrModalReaderComponent {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
        expect(wrapper.instance().state).toMatchSnapshot();

        // open qr code screen, don't grant permissions
        CameraKitCamera.checkDeviceCameraAuthorizationStatus.mockClear();
        setCheckDeviceCameraAuthorizationStatusResult(Promise.resolve(false));
        await wrapper.instance().open();
        expect(wrapper.instance().state).toMatchSnapshot();

        // open qr code screen, grant permissions
        CameraKitCamera.checkDeviceCameraAuthorizationStatus.mockClear();
        setCheckDeviceCameraAuthorizationStatusResult(Promise.resolve(true));
        await wrapper.instance().open();
        expect(wrapper.instance().state).toMatchSnapshot();

        // press close button
        const qrScreenProps = wrapper.find('[testID="CameraKitCameraScreen"]').props();
        qrScreenProps.onBottomButtonPressed();
        expect(wrapper.instance().state).toMatchSnapshot();

        // open qr screen
        setCheckDeviceCameraAuthorizationStatusResult(Promise.resolve(true));
        await wrapper.instance().open();
        // trigger onRead
        qrScreenProps.onReadCode({
            nativeEvent: {
                codeStringValue: 'QR_CODE_VALUE'
            }
        });
        expect(wrapper.instance().state).toMatchSnapshot();
        expect(props.onQrCodeScanned).toHaveBeenCalledWith('QR_CODE_VALUE');
    });
});
