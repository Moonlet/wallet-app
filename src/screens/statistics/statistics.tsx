import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '../../library';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';

import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { HeaderIcon } from '../../components/header-icon/header-icon';
import { SkeletonRow } from '../../components/skeleton-row/skeleton-row';

export const mapStateToProps = () => {
    return {};
};

export const navigationOptions = () => ({
    headerLeft: () => <HeaderIcon />,
    title: translate('App.labels.statistics')
});

export class StatisticsScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    constructor(props: INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

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
                    <Text style={styles.newSectionText}>{translate('Statistics.newSection')}</Text>
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

export const StatisticsScreen = smartConnect(StatisticsScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
