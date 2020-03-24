import React from 'react';
import { View, Modal, Platform, Linking } from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { translate } from '../../core/i18n';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { Dialog } from '../dialog/dialog';
import { smartConnect } from '../../core/utils/smart-connect';
import { setDisplayPasswordModal } from '../../redux/ui/password-modal/actions';
import { connect } from 'react-redux';
import { checkDeviceCameraPermission } from '../../core/utils/request-permissions';

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

    public open = async () => {
        this.props.setDisplayPasswordModal(false);

        const accessGranted = await checkDeviceCameraPermission();

        if (accessGranted) {
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
                        onBottomButtonPressed={() => {
                            this.setState({ isVisible: false });
                            this.props.setDisplayPasswordModal(true);
                        }}
                        scanBarcode={true}
                        onReadCode={event => {
                            this.setState({ isVisible: false });
                            this.props.onQrCodeScanned(event.nativeEvent.codeStringValue);
                            this.props.setDisplayPasswordModal(true);
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
