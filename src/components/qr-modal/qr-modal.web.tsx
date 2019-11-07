import React from 'react';
import { View } from 'react-native';

export interface IProps {
    onQrCodeScanned: (qrCode: string) => any;
}

export class QrModalReaderComponent extends React.Component<IProps> {
    public render() {
        return <View />;
    }
}

export const QrModalReader = QrModalReaderComponent;
