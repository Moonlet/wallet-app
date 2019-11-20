import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '../../library';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { IReduxState } from '../../redux/state';
import { ITheme } from '../../core/theme/itheme';

import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { withTheme } from '../../core/theme/with-theme';
import { HeaderLeft } from '../../components/header-left/header-left';
import { SkeletonRow } from '../../components/skeleton-row/skeleton-row';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

const mapStateToProps = (state: IReduxState) => ({});

const mapDispatchToProps = {};

const navigationOptions = {
    title: 'Rewards',
    headerLeft: <HeaderLeft icon="saturn-icon" />
};

export class RewardsScreenComponent extends React.Component<IProps> {
    public static navigationOptions = navigationOptions;

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={styles.skeletonRow}>
                    <SkeletonRow opacity={0.9} />
                </View>

                <Image
                    style={styles.logoImage}
                    source={require('../../assets/images/png/moonlet_space.png')}
                />

                <Text style={styles.launchingSoonText}>Launching soon!</Text>
                <Text style={styles.newSectionText}>
                    A new section to get rewards by staking your tokens is in the work.
                </Text>

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

export const RewardsScreen = smartConnect(RewardsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
