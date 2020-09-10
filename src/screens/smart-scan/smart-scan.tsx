import React from 'react';
import { View, Image } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { Text } from '../../library';
import { SkeletonRow } from '../../components/skeleton-row/skeleton-row';

export const navigationOptions = () => ({
    headerLeft: <HeaderIcon />,
    title: translate('SmartScan.title')
});

export class SmartScanScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;
    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={styles.skeletonRow}>
                    <SkeletonRow opacity={0.9} />
                </View>

                <View style={styles.textSection}>
                    <Image
                        style={styles.logoImage}
                        source={require('../../assets/images/png/moonlet_space.png')}
                    />
                    <Text style={styles.launchingSoonText}>
                        {translate('Statistics.launchingSoon')}
                    </Text>
                    <Text style={styles.newSectionText}>{translate('SmartScan.newSection')}</Text>
                </View>

                <View style={styles.skeletonRow}>
                    <SkeletonRow opacity={0.7} />
                </View>

                <View style={styles.skeletonRow}>
                    <SkeletonRow opacity={0.5} />
                </View>

                <View style={styles.skeletonRow}>
                    <SkeletonRow opacity={0.3} />
                </View>
            </View>
        );
    }
}

export const SmartScanScreen = smartConnect(SmartScanScreenComponent, [withTheme(stylesProvider)]);
