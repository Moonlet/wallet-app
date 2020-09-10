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
import { QuickActionCard } from '../quick-action-card/quick-action-card';

interface IExternalProps {
    blockchain: Blockchain;
    account: IAccountState;
    showBottomPadding: boolean;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    chainId: ChainIdType;
}

interface IReduxProps {
    openBottomSheet: typeof openBottomSheet;
}

const mapDispatchToProps = {
    openBottomSheet
};

export const TokenDashboardComponent = (
    props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const renderCard = (options: { title?: string; icon: IconValues; onPress: () => void }) => {
        return (
            <TouchableHighlight
                onPress={() => options.onPress()}
                underlayColor={props.theme.colors.appBackground}
            >
                <View style={props.styles.cardContainer}>
                    <Icon name={options.icon} size={normalize(16)} style={props.styles.icon} />
                    {options.title && <Text style={props.styles.cardText}>{options.title}</Text>}
                </View>
            </TouchableHighlight>
        );
    };

    return (
        <View style={props.styles.container}>
            <View style={props.styles.cardWrapper}>
                {renderCard({
                    title: translate('Account.manageAccounts'),
                    icon: IconValues.PENCIL,
                    onPress: () => NavigationService.navigate('ManageAccounts', {})
                })}
                {renderCard({
                    title: translate('DashboardMenu.transactionHistory'),
                    icon: IconValues.ARCHIVE_LOCKER,
                    onPress: () => NavigationService.navigate('TransactonsHistory', {})
                })}
                {renderCard({
                    icon: IconValues.NAVIGATION_MENU_HORIZONTAL,
                    onPress: () => props.openBottomSheet(BottomSheetType.DASHBOARD_MENU)
                })}
            </View>

            <View
                style={[
                    props.styles.tokensContainer,
                    { paddingBottom: props.showBottomPadding ? normalize(70) : 0 }
                ]}
            >
                {props.account?.tokens &&
                    props.chainId &&
                    Object.values(props.account.tokens[props.chainId]).map(
                        (token: ITokenState, index: number) =>
                            token.active && (
                                <TokenCard
                                    account={props.account}
                                    token={token}
                                    navigation={props.navigation}
                                    key={`token-${index}`}
                                    blockchain={props.blockchain}
                                    index={index}
                                />
                            )
                    )}

                <QuickActionCard
                    blockchain={props.blockchain}
                    account={props.account}
                    chainId={props.chainId}
                    style={props.styles.quickActionCardContainer}
                />
            </View>
        </View>
    );
};
export const TokenDashboard = smartConnect<IExternalProps>(TokenDashboardComponent, [
    connect(null, mapDispatchToProps),
    withTheme(stylesProvider)
]);
