import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { Blockchain, ChainIdType } from '../../../../../../../core/blockchain/types';
import { AccountAddress } from '../../../../../../../components/account-address/account-address';
import { AccountType, IAccountState, ITokenState } from '../../../../../../../redux/wallets/state';
import { IReduxState } from '../../../../../../../redux/state';
import { getAccount, getNrPendingTransactions } from '../../../../../../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../../../../../redux/preferences/selectors';
import { Button } from '../../../../../../../library';
import { translate } from '../../../../../../../core/i18n';
import { NavigationService } from '../../../../../../../navigation/navigation-service';
import { CtaGroup } from '../../../../../../../components/cta-group/cta-group';
import { PosBasicActionType } from '../../../../../../../core/blockchain/types/token';
import { fetchValidators } from '../../../../../../../redux/ui/validators/actions';
import { fetchDelegatedValidators } from '../../../../../../../redux/ui/delegated-validators/actions';
import { Dialog } from '../../../../../../../components/dialog/dialog';
import { SmartScreenComponent } from '../../../../../../../components/smart-screen/smart-screen';
import { ContextScreen, ContextTab } from '../../../../../../../components/widgets/types';
import {
    isFeatureActive,
    RemoteFeature
} from '../../../../../../../core/utils/remote-feature-config';

interface IExternalProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
}

interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;

    fetchValidators: typeof fetchValidators;
    fetchDelegatedValidators: typeof fetchDelegatedValidators;
    hasPendingTransactions: boolean;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const account = getAccount(state, ownProps.accountIndex, ownProps.blockchain);
    const chainId = getChainId(state, ownProps.blockchain);

    return {
        account,
        chainId,
        hasPendingTransactions: getNrPendingTransactions(state)
    };
};

const mapDispatchToProps = {
    fetchValidators,
    fetchDelegatedValidators
};

export class AccountTabComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public componentDidMount() {
        this.props.fetchValidators(this.props.account, PosBasicActionType.DELEGATE);
        this.props.fetchDelegatedValidators(this.props.account);
    }

    public render() {
        const { styles } = this.props;
        const blockchainInstance = getBlockchain(this.props.blockchain);

        const tokenUiConfig = blockchainInstance.config.ui.token;
        let mainCta = tokenUiConfig.accountCTA.mainCta;
        if (isFeatureActive(RemoteFeature.ZIL_STAKING_SMART_SCREEN)) {
            mainCta =
                tokenUiConfig.accountCTA?.mainCtaSmartScreen || tokenUiConfig.accountCTA.mainCta;
        }

        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <AccountAddress account={this.props.account} token={this.props.token} />

                        <View style={styles.buttonsRowContainer}>
                            <Button
                                key={`cta-send`}
                                style={styles.button}
                                wrapperStyle={{ flex: 1 }}
                                onPress={() => {
                                    if (!this.props.hasPendingTransactions) {
                                        NavigationService.navigate('Send', {
                                            accountIndex: this.props.account.index,
                                            blockchain: this.props.account.blockchain,
                                            token: this.props.token
                                        });
                                    } else {
                                        Dialog.alert(
                                            translate('Validator.cannotInitiateTxTitle'),
                                            translate('Validator.cannotInitiateTxMessage'),
                                            undefined,
                                            {
                                                text: translate('App.labels.ok'),
                                                onPress: () =>
                                                    NavigationService.navigate(
                                                        'TransactonsHistory',
                                                        {}
                                                    )
                                            }
                                        );
                                    }
                                }}
                                disabledSecondary={
                                    this.props.account.type === AccountType.LOCKUP_CONTRACT
                                }
                            >
                                {translate('App.labels.send')}
                            </Button>
                            <Button
                                key={`cta-receive`}
                                style={styles.button}
                                wrapperStyle={{ flex: 1 }}
                                onPress={() =>
                                    NavigationService.navigate('Receive', {
                                        accountIndex: this.props.account.index,
                                        blockchain: this.props.account.blockchain,
                                        token: this.props.token
                                    })
                                }
                            >
                                {translate('App.labels.receive')}
                            </Button>
                            <Button
                                style={styles.button}
                                wrapperStyle={{ flex: 1 }}
                                onPress={() =>
                                    NavigationService.navigate('SmartScreen', {
                                        context: {
                                            screen: 'Swap',
                                            step: 'SwapEnterAmount',
                                            key: 'swap-enter-amount'
                                        },
                                        navigationOptions: {
                                            title: 'Swap' //
                                        }
                                    })
                                }
                            >
                                {'Swap'}
                            </Button>
                        </View>

                        {Platform.OS !== 'web' && (
                            <SmartScreenComponent
                                context={{
                                    screen: ContextScreen.TOKEN,
                                    tab: ContextTab.ACCOUNT
                                }}
                            />
                        )}
                    </ScrollView>
                </View>
                <View style={styles.bottomContainer}>
                    <CtaGroup
                        mainCta={mainCta}
                        params={{
                            accountIndex: this.props.account.index,
                            blockchain: this.props.account.blockchain,
                            token: this.props.token,
                            validators: [],
                            canPerformAction: !this.props.hasPendingTransactions
                        }}
                    />
                </View>
            </View>
        );
    }
}

export const AccountTab = smartConnect<IExternalProps>(AccountTabComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
