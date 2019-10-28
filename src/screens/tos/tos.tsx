import React from 'react';
import { View } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Text } from '../../library';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export const TosScreenComponent = (props: IProps) => (
    <View style={props.styles.container}>
        <Text>TOS blablax</Text>
    </View>
);

export const navigationOptions = {
    title: 'TOS'
};

export const TosScreen = withTheme(stylesProvider)(TosScreenComponent);

TosScreen.navigationOptions = navigationOptions;
