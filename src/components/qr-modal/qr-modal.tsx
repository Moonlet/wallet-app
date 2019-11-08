import React from 'react';
import { View, Modal } from 'react-native';
import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit';

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

    public open = async () => {
        // TODO: hadle exceptions (promise rejection)
        const success = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();
        if (success) {
            this.setState({ isVisible: true });
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
                    />
                </View>
            </Modal>
        );
    }
}

export const QrModalReader = QrModalReaderComponent;
