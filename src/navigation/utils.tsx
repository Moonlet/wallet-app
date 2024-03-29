import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from '../components/icon/icon';
import { COLORS } from '../styles/colors';
import { BASE_DIMENSION, normalize } from '../styles/dimensions';
import NewIcon from '../assets/images/svg/new.svg';

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
        <NewIcon
            width={normalize(22)}
            height={normalize(22)}
            style={{
                position: 'absolute',
                top: -BASE_DIMENSION,
                right: -(BASE_DIMENSION * 3 + BASE_DIMENSION / 2)
            }}
        />
        <Icon
            name={icon}
            size={normalize(25)}
            style={{ color: focused ? COLORS.AQUA : COLORS.DARK_GRAY }}
        />
    </View>
);
