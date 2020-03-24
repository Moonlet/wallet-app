import { Platform, PermissionsAndroid } from 'react-native';
import { CameraKitCamera } from 'react-native-camera-kit';

const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

export const checkDeviceCameraPermission = () =>
    new Promise<boolean>(async resolve => {
        let success = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();

        if (success === -1 || success === false) {
            if (Platform.OS === 'android') {
                // because on Android, requestDeviceCameraAuthorization does not return a promise (library bug)

                success = await requestCameraPermission();
                resolve(success);
            } else {
                success = await CameraKitCamera.requestDeviceCameraAuthorization();
                resolve(success);
            }
        } else {
            resolve(true);
        }
    });
