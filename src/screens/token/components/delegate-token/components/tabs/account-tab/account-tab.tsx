import React from 'react';
import { View, ScrollView } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { Blockchain, ChainIdType } from '../../../../../../../core/blockchain/types';
import { AccountAddress } from '../../../../../../../components/account-address/account-address';
import { IAccountState, ITokenState } from '../../../../../../../redux/wallets/state';
import { IReduxState } from '../../../../../../../redux/state';
import { getAccount } from '../../../../../../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { bind } from 'bind-decorator';
import { StatsComponent } from '../../stats-component/stats-component';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../../../../../redux/preferences/selectors';
import { Button } from '../../../../../../../library';
import { translate } from '../../../../../../../core/i18n';
import { NavigationService } from '../../../../../../../navigation/navigation-service';
import { CtaGroup } from '../../../../../../../components/cta-group/cta-group';
import { PosWidget } from '../../../../../../../components/pos-widget/pos-widget';
import { PosBasicActionType } from '../../../../../../../core/blockchain/types/token';
import { formatNumber } from '../../../../../../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { getTokenConfig } from '../../../../../../../redux/tokens/static-selectors';
import { withdraw, activate, claimRewardNoInput } from '../../../../../../../redux/wallets/actions';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { fetchValidators } from '../../../../../../../redux/ui/validators/actions';
import { fetchDelegatedValidators } from '../../../../../../../redux/ui/delegated-validators/actions';
import moment from 'moment';
import { AffiliateBanner } from '../../../../../../../components/affiliate-banner/affiliate-banner';
import { fetchAccountDelegateStats } from '../../../../../../../redux/ui/stats/actions';
import { getAccountStats } from '../../../../../../../redux/ui/stats/selectors';
import { AccountStats, IPosWidget } from '../../../../../../../core/blockchain/types/stats';

interface IExternalProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    accountStats: AccountStats;
    withdraw: typeof withdraw;
    claimRewardNoInput: typeof claimRewardNoInput;
    activate: typeof activate;
    fetchValidators: typeof fetchValidators;
    fetchDelegatedValidators: typeof fetchDelegatedValidators;
    fetchAccountDelegateStats: typeof fetchAccountDelegateStats;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const account = getAccount(state, ownProps.accountIndex, ownProps.blockchain);
    const chainId = getChainId(state, ownProps.blockchain);

    return {
        account,
        chainId,
        accountStats: getAccountStats(state, ownProps.blockchain, chainId, account.address)
    };
};

const mapDispatchToProps = {
    withdraw,
    activate,
    fetchValidators,
    claimRewardNoInput,
    fetchDelegatedValidators,
    fetchAccountDelegateStats
};

export class AccountTabComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public componentDidMount() {
        this.props.fetchValidators(this.props.account, PosBasicActionType.DELEGATE);
        this.props.fetchDelegatedValidators(this.props.account);
        this.props.fetchAccountDelegateStats(this.props.account, this.props.token);
    }

    @bind
    public async onPress(widget: IPosWidget) {
        switch (widget.type) {
            case PosBasicActionType.ACTIVATE: {
                this.props.activate(
                    this.props.account,
                    this.props.token.symbol,
                    this.props.navigation,
                    undefined
                );
                break;
            }
            case PosBasicActionType.CLAIM_REWARD_NO_INPUT: {
                this.props.claimRewardNoInput(
                    this.props.account,
                    [widget.validator],
                    this.props.token.symbol,
                    this.props.navigation,
                    undefined
                );
                break;
            }

            case PosBasicActionType.WITHDRAW: {
                this.props.withdraw(
                    this.props.account,
                    this.props.token.symbol,
                    this.props.navigation,
                    {
                        witdrawIndex: widget?.index,
                        validatorId: widget?.validator?.id,
                        amount: widget?.value
                    },
                    undefined
                );
                break;
            }
        }
    }

    public renderWidgets() {
        return this.props.accountStats.widgets.map((widget, index) => {
            const widgetTimestamp = Number(widget.timestamp) * 1000;
            const isActive = widgetTimestamp < Date.now() || widget.timestamp === '' ? true : false;
            const blockchainInstance = getBlockchain(this.props.blockchain);
            const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);
            const amountFromStd = blockchainInstance.account.amountFromStd(
                new BigNumber(widget.value),
                tokenConfig.decimals
            );

            const hours = moment(new Date(widgetTimestamp)).diff(moment(new Date()), 'hours');
            const minutes =
                moment(new Date(widgetTimestamp)).diff(moment(new Date()), 'minute') / (hours * 60);
            const timeString = isActive
                ? '00h 00m'
                : `${Math.round(hours)}h ${Math.round(minutes)}m`;

            switch (widget.type) {
                case PosBasicActionType.ACTIVATE: {
                    return (
                        <PosWidget
                            key={`widget-${index}`}
                            title={translate('Widget.activateVotesTitle')}
                            middleTitle={formatNumber(new BigNumber(amountFromStd), {
                                currency: this.props.token.symbol,
                                minimumFractionDigits: 2
                            })}
                            bottomTitle={translate('Widget.waitTimeActivate', {
                                timeFormat: timeString
                            })}
                            buttonText={translate('App.labels.activate')}
                            buttonColor={this.props.theme.colors.labelReward}
                            buttonDisabled={!isActive}
                            onPress={() => this.onPress(widget)}
                        />
                    );
                }
                case PosBasicActionType.CLAIM_REWARD_NO_INPUT: {
                    return (
                        <PosWidget
                            key={`widget-${index}`}
                            title={translate('Widget.claimText')}
                            middleTitle={formatNumber(new BigNumber(amountFromStd), {
                                currency: this.props.token.symbol,
                                minimumFractionDigits: 2
                            })}
                            bottomTitle={`${translate('App.labels.from').toLowerCase()} ${
                                widget.validator?.name
                            }`}
                            buttonText={translate('App.labels.claim')}
                            buttonColor={this.props.theme.colors.labelReward}
                            buttonDisabled={false}
                            onPress={() => this.onPress(widget)}
                        />
                    );
                }
                case PosBasicActionType.WITHDRAW: {
                    return (
                        <PosWidget
                            key={`widget-${index}`}
                            title={translate('Widget.withdrawText', {
                                coin: this.props.token.symbol
                            })}
                            middleTitle={`${formatNumber(new BigNumber(amountFromStd), {
                                currency: this.props.token.symbol,
                                minimumFractionDigits: 2
                            })} ${
                                widget?.validator?.name
                                    ? `${String(
                                          translate('App.labels.from').toLocaleLowerCase()
                                      )} ${widget.validator.name}`
                                    : ''
                            }`}
                            bottomTitle={translate('Widget.waitTimeWithdraw', {
                                timeFormat: timeString
                            })}
                            buttonText={translate('App.labels.withdraw')}
                            buttonDisabled={!isActive}
                            buttonColor={this.props.theme.colors.labelReward}
                            onPress={() => this.onPress(widget)}
                        />
                    );
                }
                default: {
                    return null;
                }
            }
        });
    }

    public render() {
        const styles = this.props.styles;

        const blockchainInstance = getBlockchain(this.props.blockchain);
        const tokenUiConfig = blockchainInstance.config.ui.token;
        const affiliateBanner = blockchainInstance.config.ui.affiliateBanners.account;

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
                                onPress={() =>
                                    NavigationService.navigate('Send', {
                                        accountIndex: this.props.account.index,
                                        blockchain: this.props.account.blockchain,
                                        token: this.props.token
                                    })
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
                        </View>

                        <AffiliateBanner type={affiliateBanner} style={styles.affiliateBanner} />

                        {this.props.accountStats && this.renderWidgets()}

                        <StatsComponent
                            accountStats={this.props.accountStats}
                            blockchain={this.props.blockchain}
                            token={this.props.token}
                            extraToken={this.props.account?.tokens[this.props.chainId].gZIL}
                        />
                    </ScrollView>
                </View>
                <View style={styles.bottomContainer}>
                    <CtaGroup
                        mainCta={tokenUiConfig.accountCTA.mainCta}
                        params={{
                            accountIndex: this.props.account.index,
                            blockchain: this.props.account.blockchain,
                            token: this.props.token,
                            validators: []
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
