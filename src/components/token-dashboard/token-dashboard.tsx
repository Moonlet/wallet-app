import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { TokenCard } from '../token-card/token-card';
import { normalize } from '../../styles/dimensions';
import { Text } from '../../library';
import Icon from '../icon/icon';
import { IconValues } from '../icon/values';
import { translate } from '../../core/i18n';
import { BottomSheetType } from '../../redux/ui/bottomSheet/state';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { NavigationService } from '../../navigation/navigation-service';
import { IReduxState } from '../../redux/state';
import { AccountStats } from '../../core/blockchain/types/stats';
import { fetchAccountDelegateStats } from '../../redux/ui/stats/actions';
import { getAccountStats } from '../../redux/ui/stats/selectors';
import { SmartScreen } from '../../screens/smart-screen/smart-screen';

interface IExternalProps {
    blockchain: Blockchain;
    account: IAccountState;
    showBottomPadding: boolean;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    chainId: ChainIdType;
}

interface IReduxProps {
    accountStats: AccountStats;
    openBottomSheet: typeof openBottomSheet;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        accountStats:
            ownProps.account &&
            getAccountStats(state, ownProps.blockchain, ownProps.chainId, ownProps.account.address)
    };
};

const mapDispatchToProps = {
    openBottomSheet,
    fetchAccountDelegateStats
};

export class TokenDashboardComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    private renderCard(options: { title?: string; icon: IconValues; onPress: () => void }) {
        const { styles, theme } = this.props;

        return (
            <TouchableHighlight
                onPress={() => options.onPress()}
                underlayColor={theme.colors.appBackground}
            >
                <View style={styles.cardContainer}>
                    <Icon name={options.icon} size={normalize(16)} style={styles.icon} />
                    {options.title && (
                        <Text style={styles.cardText} numberOfLines={1}>
                            {options.title}
                        </Text>
                    )}
                </View>
            </TouchableHighlight>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.cardWrapper}>
                    {this.renderCard({
                        title: translate('Account.switchAccounts'), // manageAccounts
                        icon: IconValues.ACTION_UP_DOWN, // IconValues.PENCIL,
                        onPress: () => NavigationService.navigate('ManageAccounts', {})
                    })}

                    {this.renderCard({
                        title: translate('DashboardMenu.transactionHistory'),
                        icon: IconValues.ARCHIVE_LOCKER,
                        onPress: () => NavigationService.navigate('TransactonsHistory', {})
                    })}

                    {this.renderCard({
                        icon: IconValues.NAVIGATION_MENU_HORIZONTAL,
                        onPress: () => this.props.openBottomSheet(BottomSheetType.DASHBOARD_MENU)
                    })}
                </View>

                <View
                    style={[
                        styles.tokensContainer,
                        { paddingBottom: this.props.showBottomPadding ? normalize(70) : 0 }
                    ]}
                >
                    <SmartScreen context={{ screen: 'dashboard' }} />

                    {this.props.account?.tokens &&
                        this.props.chainId &&
                        Object.values(this.props.account.tokens[this.props.chainId]).map(
                            (token: ITokenState, index: number) =>
                                token.active && (
                                    <TokenCard
                                        account={this.props.account}
                                        token={token}
                                        navigation={this.props.navigation}
                                        key={`token-${index}`}
                                        blockchain={this.props.blockchain}
                                        index={index}
                                    />
                                )
                        )}
                </View>
            </View>
        );
    }
}
export const TokenDashboard = smartConnect<IExternalProps>(TokenDashboardComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
