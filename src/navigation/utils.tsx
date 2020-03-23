import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from '../components/icon';
import { COLORS } from '../styles/colors';
import { StackViewStyleInterpolator } from 'react-navigation-stack';
import { normalize } from '../library';

export const DummyScreen = () => (
    <View style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
        <Text style={{ textAlign: 'center' }}>some screen</Text>
    </View>
);

// TODO use theme for colors
export const menuIcon = (icon: string) => ({ focused }: any) => (
    <Icon
        name={icon}
        size={normalize(25)}
        style={{ color: focused ? COLORS.AQUA : COLORS.DARK_GRAY }}
    />
);

// remove animation when transitioning to any of `noAnimationScreens`
export const removeAnimation = (noAnimationScreens: string[]) => sceneProps => {
    if (noAnimationScreens.indexOf(sceneProps.scene.route.routeName) !== -1) {
        return null;
    }
    return StackViewStyleInterpolator.forHorizontal(sceneProps);
};
