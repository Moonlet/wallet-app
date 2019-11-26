import React from 'react';
import { View, Modal, Alert, Platform, Linking } from 'react-native';
import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit';
import { translate } from '../../core/i18n';
import AndroidOpenSettings from 'react-native-android-open-settings';

export interface IProps {
    onQrCodeScanned: (qrCode: string) => any;
}

interface IState {
    isVisible: boolean;
}

export class QrModalReaderComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isVisible: false
        };
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

    public open = async () => {
        let success = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();

        if (success === -1) {
            success = await CameraKitCamera.requestDeviceCameraAuthorization();
        }
        if (success) {
            this.setState({ isVisible: true });
        } else {
            Alert.alert(
                translate('Send.cameraDisabledTitle'),
                translate('Send.cameraDisabledText'),
                [
                    {
                        text: translate('App.labels.cancel'),
                        onPress: () => {
                            this.setState({ isVisible: false });
                        },
                        style: 'cancel'
                    },
                    {
                        text: translate('App.labels.settings'),
                        onPress: () => {
                            this.openPhoneSettings();
                        }
                    }
                ]
            );
        }
    };

    public render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.isVisible}
                presentationStyle={'overFullScreen'}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(100,100,100,0.9)'
                    }}
                >
                    <CameraKitCameraScreen
                        testID="CameraKitCameraScreen"
                        actions={{ leftButtonText: 'Cancel' }}
                        onBottomButtonPressed={event =>
                            this.setState({
                                isVisible: false
                            })
                        }
                        scanBarcode={true}
                        onReadCode={event => {
                            this.setState({
                                isVisible: false
                                //    address: event.nativeEvent.codeStringValue
                            });
                            this.props.onQrCodeScanned(event.nativeEvent.codeStringValue);
                        }}
                        showFrame={true}
                        offsetForScannerFrame={10}
                        heightForScannerFrame={500}
                        colorForScannerFrame={'red'}
                        frameColor={'red'}
                        laserColor={'white'}
                    />
                </View>
            </Modal>
        );
    }
}

export const QrModalReader = QrModalReaderComponent;
