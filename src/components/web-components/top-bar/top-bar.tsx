import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../../../components/icon/icon';
import { IconValues } from '../../../components/icon/values';
import { normalize } from '../../../styles/dimensions';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../core/theme/with-theme';
export const TopBarComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    const styles = props.styles;
    return (
        <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 0 }}
            colors={[
                props.theme.colors.webGradientOuter,
                props.theme.colors.webGradientInner,
                props.theme.colors.webGradientOuter
            ]}
            style={styles.headerContainer}
        >
            <View style={styles.headerLeft}>
                <Text style={styles.logoText}>M</Text>
                <Icon name={IconValues.SATURN_ICON} size={normalize(6)} style={styles.icon} />
                <Text style={styles.logoText}>ONLET</Text>
            </View>
            <View style={styles.headerCenter}>
                <Icon name={IconValues.BI23_LABS} size={normalize(6)} style={styles.icon} />
                <Text style={styles.headerCenterText}>Bi23 Labs</Text>
            </View>
            <View style={styles.headerRight}>
                <View style={styles.socialContainer}>
                    <Icon
                        name={IconValues.GITHUB}
                        size={normalize(4)}
                        style={[styles.socialIcon, styles.separator]}
                    />
                    <Icon name={IconValues.TWITTER} size={normalize(4)} style={styles.socialIcon} />
                    <Icon
                        name={IconValues.LINKEDIN}
                        size={normalize(4)}
                        style={styles.socialIcon}
                    />
                </View>
            </View>
        </LinearGradient>
    );
};

export const TopBar = withTheme(stylesProvider)(TopBarComponent);
