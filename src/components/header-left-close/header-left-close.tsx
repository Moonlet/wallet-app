import React from 'react';
import { HeaderLeft } from '../header-left/header-left';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export const HeaderLeftClose = ({ navigation }: IProps) => (
    <HeaderLeft icon="close" onPress={() => navigation.goBack()} />
);
