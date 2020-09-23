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
import { withdraw, activate } from '../../../../../../../redux/wallets/actions';
import { PasswordModal } from '../../../../../../../components/password-modal/password-modal';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { fetchValidators } from '../../../../../../../redux/ui/validators/actions';
import { fetchDelegatedValidators } from '../../../../../../../redux/ui/delegated-validators/actions';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import moment from 'moment';
import { AffiliateBanner } from '../../../../../../../components/affiliate-banner/affiliate-banner';
import { AccountStats, IPosWidget } from '../../../../../../../redux/ui/stats/state';

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    withdraw: typeof withdraw;
    activate: typeof activate;
    fetchValidators: typeof fetchValidators;
    fetchDelegatedValidators: typeof fetchDelegatedValidators;
}

export const mapStateToProps = (state: IReduxState, ownProps: IProps) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    withdraw,
    activate,
    fetchValidators,
    fetchDelegatedValidators
};

interface IState {
    accountStats: AccountStats;
}

export class AccountTabComponent extends React.Component<
    IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            accountStats: undefined
        };
    }
    public componentDidMount() {
        const blockchainInstance = getBlockchain(this.props.blockchain);
        blockchainInstance
            .getStats(this.props.chainId)
            .getAccountDelegateStats(this.props.account, this.props.token)
            .then(accStats => {
                this.setState({ accountStats: accStats });
            })
            .catch(e => {
                SentryCaptureException(new Error(JSON.stringify(e)));
            });

        this.props.fetchValidators(this.props.account, PosBasicActionType.DELEGATE);
        this.props.fetchDelegatedValidators(this.props.account);
    }

    @bind
    public async onPress(widget: IPosWidget) {
        const password = await PasswordModal.getPassword(
            translate('Password.pinTitleUnlock'),
            translate('Password.subtitleSignTransaction'),
            { sensitive: true, showCloseButton: true }
        );

        switch (widget.type) {
            case PosBasicActionType.ACTIVATE: {
                this.props.activate(
                    this.props.account,
                    this.props.token.symbol,
                    password,
                    this.props.navigation,
                    undefined
                );
                break;
            }
            case PosBasicActionType.WITHDRAW: {
                this.props.withdraw(
                    this.props.account,
                    this.props.token.symbol,
                    password,
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
        return this.state.accountStats.widgets.map((widget, index) => {
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

                        {this.state.accountStats && this.renderWidgets()}

                        <StatsComponent
                            accountStats={this.state.accountStats}
                            blockchain={this.props.blockchain}
                            token={this.props.token}
                            extraToken={this.props.account?.tokens[this.props.chainId].GZIL}
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

export const AccountTab = smartConnect<IProps>(AccountTabComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
