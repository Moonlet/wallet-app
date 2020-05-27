import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../core/utils/smart-connect';

interface IExternalProps {
    navigationState: any;
}

export const LegalModalComponent = () => {
    return <View />;
};

export const LegalModal = smartConnect<IExternalProps>(LegalModalComponent);
