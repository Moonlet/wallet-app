import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { getAccount } from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import { Blockchain, IFeeOptions, ChainIdType } from '../../core/blockchain/types';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import BigNumber from 'bignumber.js';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';
import { TokenType, DelegationType } from '../../core/blockchain/types/token';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { Amount } from '../../components/amount/amount';
import _ from 'lodash';
import { Icon } from '../../components/icon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { EnterAmount } from '../send/components/enter-amount/enter-amount';
import { HeaderStepByStep } from '../send/components/header-step-by-step/header-step-by-step';
import { getChainId } from '../../redux/preferences/selectors';
import { Memo } from '../send/components/extra-fields/memo/memo';
import { FeeOptions } from '../send/components/fee-options/fee-options';
import { IValidator, CardActionType } from '../../core/blockchain/types/stats';
import { ValidatorsList } from '../token/components/delegate-token/components/validators/validators-list/validators-list';
import { bind } from 'bind-decorator';
import { BottomCta } from '../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../components/bottom-cta/amount-cta-field/amount-cta-field';

interface IHeaderStep {
    step: number;
    title: string;
    active: boolean;
}

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    //
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    delegationType: DelegationType;
    validators: IValidator[];
    title: string;
}

interface IState {
    toAddress: string;
    amount: string;
    insufficientFunds: boolean;
    feeOptions: IFeeOptions;
    showExtensionMessage: boolean;
    memo: string;
    headerSteps: IHeaderStep[];
    insufficientFundsFees: boolean;
    nrValidators: number;
    validatorsList: IValidator[];
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate(navigation.state.params.title || 'App.labels.send')
});
export class DelegateScreenComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IReduxProps &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps<INavigationParams> &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        // celo steps
        const step1 = translate('Send.selectValidator');
        const step2 = translate('Send.enterAmount');
        const step3 = translate('Send.confirmVote');

        this.state = {
            nrValidators: 1,
            toAddress: '',
            amount: '',
            insufficientFunds: false,
            feeOptions: undefined,
            showExtensionMessage: false,
            memo: '',
            headerSteps: [
                { step: 1, title: step1, active: true },
                { step: 2, title: step2, active: false },
                { step: 3, title: step3, active: false }
            ],
            insufficientFundsFees: false,
            validatorsList: props.validators
        };
    }

    public async confirmPayment() {
        // confirm payment
    }

    public onMemoInput(memo: string) {
        this.setState({ memo });
    }

    public addAmount(value: string) {
        const amount = value.replace(/,/g, '.');
        this.setState({ amount }, () => this.availableFunds());
    }

    public availableAmount() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        let balance: BigNumber = new BigNumber(this.props.token.balance?.value);
        if (tokenConfig.type === TokenType.NATIVE) {
            balance = balance.minus(this.state.feeOptions?.feeTotal);
        }

        if (balance.isGreaterThanOrEqualTo(0)) {
            const blockchainInstance = getBlockchain(this.props.account.blockchain);
            const amountFromStd = blockchainInstance.account.amountFromStd(
                new BigNumber(balance),
                tokenConfig.decimals
            );
            return amountFromStd.toString();
        } else {
            return new BigNumber(0).toString();
        }
    }

    public availableFunds() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        // Amount check
        const inputAmount = this.getInputAmountToStd();
        const availableAmount = new BigNumber(this.props.token.balance?.value);

        // amount > available amount
        if (inputAmount.isGreaterThan(availableAmount)) {
            this.setState({ insufficientFunds: true });
            return;
        } else {
            this.setState({ insufficientFunds: false });
        }

        // Fees check
        const feeTotal = new BigNumber(this.state.feeOptions?.feeTotal);

        if (tokenConfig.type === TokenType.NATIVE) {
            // feeTotal + amount > available amount
            if (feeTotal.plus(inputAmount).isGreaterThan(availableAmount)) {
                this.setState({ insufficientFundsFees: true });
            } else {
                this.setState({ insufficientFundsFees: false });
            }
        } else {
            const nativeCoin = getBlockchain(this.props.account.blockchain).config.coin;
            const nativeCoinBalance = this.props.account.tokens[this.props.chainId][nativeCoin]
                .balance?.value;
            const availableBalance = new BigNumber(nativeCoinBalance);

            // ERC20 / ZRC2
            // feeTotal > available amount
            if (feeTotal.isGreaterThan(availableBalance)) {
                this.setState({ insufficientFundsFees: true });
            } else {
                this.setState({ insufficientFundsFees: false });
            }
        }
    }

    public renderExtraFields(value: string) {
        switch (value) {
            case 'Memo':
                return <Memo key={value} onMemoInput={(memo: string) => this.onMemoInput(memo)} />;

            default:
                return null;
        }
    }

    @bind
    public onSelect(validator: IValidator) {
        let selected = true;
        if (validator.actionTypeSelected) {
            selected = !validator.actionTypeSelected;
        }

        const validators = this.state.validatorsList;
        Object.values(validators).map(object => {
            if (validator.id === object.id) object.actionTypeSelected = selected;
        });
        this.setState({ validatorsList: validators });
    }

    private renderValidatorList() {
        const { styles } = this.props;
        const blockchainInstance = getBlockchain(this.props.blockchain);
        return [
            <View key={'increase-list'} style={styles.actionContainer}>
                <TouchableOpacity
                    style={styles.actionIconContainer}
                    onPress={() => {
                        if (this.state.nrValidators > 1) {
                            const nrValidatorsNew = this.state.nrValidators - 1;
                            blockchainInstance
                                .getStats(this.props.chainId)
                                .getValidatorList(CardActionType.NAVIGATE, nrValidatorsNew)
                                .then(validators => {
                                    this.setState({
                                        nrValidators: nrValidatorsNew,
                                        validatorsList: validators
                                    });
                                })
                                .catch();
                        }
                        // decrease
                    }}
                >
                    <Icon name="plus" size={normalize(16)} style={styles.actionIcon} />
                </TouchableOpacity>
                <Text style={styles.actionCounterText}>{this.state.nrValidators}</Text>
                <TouchableOpacity
                    style={styles.actionIconContainer}
                    onPress={() => {
                        const nrValidatorsNew = this.state.nrValidators + 1;
                        blockchainInstance
                            .getStats(this.props.chainId)
                            .getValidatorList(CardActionType.NAVIGATE, nrValidatorsNew)
                            .then(validators => {
                                this.setState({
                                    nrValidators: nrValidatorsNew,
                                    validatorsList: validators
                                });
                            })
                            .catch();
                    }}
                >
                    <Icon name="plus" size={normalize(16)} style={styles.actionIcon} />
                </TouchableOpacity>
            </View>,
            <View key={'validator-list'} style={this.props.styles.listContainer}>
                <ValidatorsList
                    validators={this.state.validatorsList}
                    blockchain={this.props.blockchain}
                    onSelect={this.onSelect}
                    actionType={CardActionType.CHECKBOX}
                />
            </View>
        ];
    }

    private getInputAmountToStd(): BigNumber {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);

        return blockchainInstance.account.amountToStd(
            new BigNumber(this.state.amount ? this.state.amount : 0),
            tokenConfig.decimals
        );
    }

    public onFeesChanged(feeOptions: IFeeOptions) {
        this.setState({ feeOptions }, () => this.availableFunds());
    }

    private renderBottomConfirm() {
        const activeIndex = _.findIndex(this.state.headerSteps, ['active', true]);
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        let disableButton: boolean;
        switch (activeIndex) {
            case 0:
                // Add address
                if (this.state.toAddress === '') disableButton = true;
                break;
            case 1:
                // Enter amount
                if (
                    this.state.amount === '' ||
                    this.state.insufficientFunds ||
                    this.state.insufficientFundsFees ||
                    isNaN(Number(this.state.feeOptions?.gasLimit)) === true ||
                    isNaN(Number(this.state.feeOptions?.gasPrice))
                )
                    disableButton = true;
                break;
            case 2:
                // Confirm transaction
                disableButton = false;
                break;
            default:
                disableButton = true;
                break;
        }

        return (
            <BottomCta
                label={
                    activeIndex === this.state.headerSteps.length - 1
                        ? translate('App.labels.confirm')
                        : translate('App.labels.next')
                }
                disabled={disableButton}
                onPress={() => {
                    if (activeIndex === 2) {
                        this.confirmPayment();
                    } else {
                        const steps = this.state.headerSteps;

                        steps[activeIndex].active = false;
                        steps[activeIndex + 1].active = true;

                        this.setState({ headerSteps: steps });
                    }
                }}
            >
                <PrimaryCtaField
                    label={translate('App.labels.send')}
                    action={translate('App.labels.to')}
                    value={formatAddress(this.state.toAddress, this.props.account.blockchain)}
                />
                {(activeIndex === 1 || activeIndex === 2) && (
                    <AmountCtaField
                        tokenConfig={tokenConfig}
                        stdAmount={this.getInputAmountToStd()}
                        account={this.props.account}
                    />
                )}
            </BottomCta>
        );
    }

    private renderEnterAmount() {
        const config = getBlockchain(this.props.account.blockchain).config;

        return (
            <View key="enterAmount" style={this.props.styles.amountContainer}>
                <EnterAmount
                    availableAmount={this.availableAmount()}
                    value={this.state.amount}
                    insufficientFunds={this.state.insufficientFunds}
                    token={this.props.token}
                    blockchain={this.props.account.blockchain}
                    onChange={amount => this.addAmount(amount)}
                />
                <FeeOptions
                    token={this.props.account.tokens[this.props.chainId][config.coin]}
                    sendingToken={this.props.token}
                    account={this.props.account}
                    toAddress={this.state.toAddress}
                    onFeesChanged={(feeOptions: IFeeOptions) => this.onFeesChanged(feeOptions)}
                    insufficientFundsFees={this.state.insufficientFundsFees}
                />
            </View>
        );
    }

    private renderConfirmTransaction() {
        const { account, chainId, styles } = this.props;
        const { blockchain } = account;
        const config = getBlockchain(blockchain).config;
        const extraFields = config.ui.extraFields;

        const feeToken = getTokenConfig(
            account.blockchain,
            account.tokens[chainId][config.coin].symbol
        );
        const feeTokenSymbol = config.feeOptions.gasPriceToken;

        return (
            <View key="confirmTransaction" style={styles.confirmTransactionContainer}>
                <Text style={styles.receipientLabel}>{translate('Send.recipientLabel')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Text style={styles.confirmTransactionText}>
                        {formatAddress(this.state.toAddress, blockchain)}
                    </Text>
                </View>

                <Text style={styles.receipientLabel}>{translate('Send.amount')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Text style={styles.confirmTransactionText}>
                        {`${this.state.amount} ${this.props.token.symbol}`}
                    </Text>
                </View>

                <Text style={styles.receipientLabel}>{translate('App.labels.fees')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Amount
                        style={styles.confirmTransactionText}
                        token={feeTokenSymbol}
                        tokenDecimals={feeToken.decimals}
                        amount={this.state.feeOptions?.feeTotal}
                        blockchain={blockchain}
                    />
                </View>

                {extraFields && extraFields.map(value => this.renderExtraFields(value))}
            </View>
        );
    }

    public renderContent() {
        const { styles, delegationType } = this.props;
        const { headerSteps } = this.state;
        switch (delegationType) {
            case DelegationType.DELEGATE:
            case DelegationType.REDELEGATE:
                return (
                    <View style={styles.content}>
                        <View style={styles.headerSteps}>
                            <HeaderStepByStep
                                steps={headerSteps}
                                selectStep={selectedIdex => {
                                    const activeIndex = _.findIndex(headerSteps, ['active', true]);

                                    const steps = headerSteps;
                                    if (selectedIdex < activeIndex) {
                                        steps[activeIndex].active = false;
                                        steps[selectedIdex].active = true;
                                    }

                                    this.setState({ headerSteps: steps });
                                }}
                            />
                        </View>
                        {headerSteps.map((step, index) => {
                            if (step.active) {
                                switch (index) {
                                    case 0:
                                        return this.renderValidatorList();
                                    case 1:
                                        return this.renderEnterAmount();
                                    case 2:
                                        return this.renderConfirmTransaction();
                                    default:
                                        return null;
                                }
                            }
                        })}
                    </View>
                );
            case DelegationType.QUICK_DELEGATE:
                return this.renderValidatorList();
        }
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <TestnetBadge />

                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    {this.renderContent()}
                </KeyboardAwareScrollView>

                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const DelegateScreen = smartConnect(DelegateScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
