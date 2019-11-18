import React from 'react';
import { HeaderLeft } from '../header-left/header-left';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { translate } from '../../core/i18n';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export const HeaderLeftClose = ({ navigation }: IProps) => (
    <HeaderLeft
        icon="close"
        text={translate('App.labels.close')}
        onPress={() => {
            navigation.goBack();
        }}
    />
);
