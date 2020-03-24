import React from 'react';
import { View, Modal, Platform, Linking, PermissionsAndroid } from 'react-native';
import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit';
import { translate } from '../../core/i18n';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { Dialog } from '../dialog/dialog';
import { smartConnect } from '../../core/utils/smart-connect';
import { setDisplayPasswordModal } from '../../redux/ui/password-modal/actions';
import { connect } from 'react-redux';

export interface IExternalProps {
    onQrCodeScanned: (qrCode: string) => any;
    obRef?: any;
}

export interface IReduxProps {
    setDisplayPasswordModal: typeof setDisplayPasswordModal;
}

const mapDispatchToProps = {
    setDisplayPasswordModal
};

interface IState {
    isVisible: boolean;
}

export class QrModalReaderComponent extends React.Component<IExternalProps & IReduxProps, IState> {
    constructor(props: IExternalProps & IReduxProps) {
        super(props);

        this.state = {
            isVisible: false
        };
        props.obRef && props.obRef(this);
    }

    public openPhoneSettings() {
        if (Platform.OS === 'ios') {
            Linking.canOpenURL('app-settings:')
                .then(supported => {
                    if (supported) {
                        return Linking.openURL('app-settings:');
                    }
                })
                .catch();
        } else {
            AndroidOpenSettings.appDetailsSettings();
        }
    }

    private async requestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return null;
            }
        } catch (err) {
            throw null;
        }
    }

    public open = async () => {
        this.props.setDisplayPasswordModal(false);

        let success = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();

        if (success === -1) {
            if (Platform.OS === 'android') {
                try {
                    success = await this.requestCameraPermission();
                } catch (err) {
                    success = null;
                }
            } else {
                success = await CameraKitCamera.requestDeviceCameraAuthorization();
            }
        }

        if (success) {
            this.setState({ isVisible: true });
        } else {
            Dialog.alert(
                translate('Send.cameraDisabledTitle'),
                translate('Send.cameraDisabledText'),
                {
                    text: translate('App.labels.cancel'),
                    onPress: () => this.setState({ isVisible: false })
                },
                {
                    text: translate('App.labels.settings'),
                    onPress: () => this.openPhoneSettings()
                }
            );
        }

        this.props.setDisplayPasswordModal(true);
    };

    public render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.isVisible}
                presentationStyle={'overFullScreen'}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(100,100,100,0.9)' }}>
                    <CameraKitCameraScreen
                        testID="CameraKitCameraScreen"
                        actions={{ leftButtonText: translate('App.labels.cancel') }}
                        onBottomButtonPressed={() => this.setState({ isVisible: false })}
                        scanBarcode={true}
                        onReadCode={event => {
                            this.setState({ isVisible: false });
                            this.props.onQrCodeScanned(event.nativeEvent.codeStringValue);
                        }}
                    />
                </View>
            </Modal>
        );
    }
}

export const QrModalReader = smartConnect<IExternalProps>(QrModalReaderComponent, [
    connect(null, mapDispatchToProps)
]);
