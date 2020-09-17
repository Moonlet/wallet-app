import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../core/utils/smart-connect';
import { Text } from '../../../../../../library';
import { IStatValue, AccountStats } from '../../../../../../core/blockchain/types/stats';
import { Blockchain } from '../../../../../../core/blockchain/types';
import { ITokenState } from '../../../../../../redux/wallets/state';
import { AccountSummary } from '../../../../../../components/account-summary/account-summary';
import { statGetValueString } from '../../../../../../core/utils/stats-get-value';

interface IExternalProps {
    accountStats: AccountStats;
    blockchain: Blockchain;
    token: ITokenState;
}

export class StatsComponentInternal extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    private renderTopStats() {
        const { styles } = this.props;
        return this.props.accountStats.topStats.map((stat: IStatValue, i: number) => (
            <View key={i} style={styles.statContainer}>
                <Text style={styles.statLabelText}>{stat.title}</Text>
                <Text style={[styles.statValueText, { color: stat.color }]}>
                    {statGetValueString(stat)}
                </Text>
            </View>
        ));
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                {this.props.accountStats?.topStats.length > 0 && (
                    <View style={styles.topStatsContainer}>{this.renderTopStats()}</View>
                )}

                <AccountSummary
                    accountStats={this.props.accountStats}
                    blockchain={this.props.blockchain}
                    token={this.props.token}
                    enableExpand={false}
                    style={styles.accountSummary}
                    isLoading={!this.props.accountStats}
                />
            </View>
        );
    }
}

export const StatsComponent = smartConnect<IExternalProps>(StatsComponentInternal, [
    withTheme(stylesProvider)
]);
