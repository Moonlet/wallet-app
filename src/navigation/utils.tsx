import React from 'react';
import { View, Text, Image } from 'react-native';
import { Icon } from '../components/icon/icon';
import { COLORS } from '../styles/colors';
import { StackViewStyleInterpolator } from 'react-navigation-stack';
import { BASE_DIMENSION, normalize } from '../styles/dimensions';

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

export const menuIconWithNewLabel = (icon: string) => ({ focused }: any) => (
    <View>
        <Image
            source={require('../assets/images/png/new-tag.png')}
            style={{
                position: 'absolute',
                top: -BASE_DIMENSION,
                right: -BASE_DIMENSION * 3,
                width: normalize(21),
                height: normalize(21)
            }}
        />
        <Icon
            name={icon}
            size={normalize(25)}
            style={{ color: focused ? COLORS.AQUA : COLORS.DARK_GRAY }}
        />
    </View>
);

// remove animation when transitioning to any of `noAnimationScreens`
export const removeAnimation = (noAnimationScreens: string[]) => sceneProps => {
    if (noAnimationScreens.indexOf(sceneProps.scene.route.routeName) !== -1) {
        return null;
    }
    return StackViewStyleInterpolator.forHorizontal(sceneProps);
};
