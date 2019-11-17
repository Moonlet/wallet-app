import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Icon } from '../../components/icon';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { ITheme } from '../../core/theme/itheme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { HeaderLeft } from '../../components/header-left/header-left';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { ITransactionState, IAccountState } from '../../redux/wallets/state';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    transaction: ITransactionState;
    account: IAccountState;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        transaction: state.wallets[state.app.currentWalletIndex].accounts[ownProps.accountIndex]
    };
};

export interface INavigationParams {
    accountIndex: number;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        return (
            <HeaderLeft
                icon="close"
                text="Close"
                onPress={() => {
                    navigation.goBack();
                }}
            />
        );
    },
    title: 'Send'
});
export class TransactionDetailsComponent extends React.Component<
    INavigationProps<INavigationParams> & IProps & IReduxProps
> {
    public static navigationOptions = navigationOptions;

    public goToExplorer = () => {
        const url = getBlockchain(this.props.account.blockchain).networks[0].explorer.getAccountUrl(
            this.props.transaction.fromAddress
        );
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    };

    public render() {
        const styles = this.props.styles;
        return (
            <ScrollView style={styles.container}>
                <TouchableOpacity
                    testID={'transaction-id'}
                    style={styles.rowContainer}
                    onPress={this.goToExplorer}
                >
                    <Text style={styles.textRow}>{translate('Transaction.transactionID')}</Text>
                    <View style={styles.rightContainer}>
                        <Icon name="arrow-right-1" size={16} style={styles.icon} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

export const TransactionDetails = smartConnect(TransactionDetailsComponent, [
    connect(mapStateToProps, {}),
    withTheme(stylesProvider),
    withNavigationParams()
]);
