import React from 'react';
import { View } from 'react-native';
import { IReduxState } from '../../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../../../core/i18n';
import { getAccount } from '../../../../redux/wallets/selectors';
import { Blockchain, ChainIdType, IFeeOptions } from '../../../../core/blockchain/types';
import BigNumber from 'bignumber.js';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { TestnetBadge } from '../../../../components/testnet-badge/testnet-badge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { BottomCta } from '../../../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../../components/bottom-cta/amount-cta-field/amount-cta-field';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { ValidatorDelegateAmount } from '../../components/validator-delegate-amount/validator-delegate-amount';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { EnterAmount } from '../../../send/components/enter-amount/enter-amount';
import { FeeOptions } from '../../../send/components/fee-options/fee-options';
import { TokenType } from '../../../../core/blockchain/types/token';

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;

    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    actionText: string;
}

export const mapStateToProps = (state: IReduxState) => {
    const accountIndex = state.ui.screens.posActions.quickDelegateEnterAmount.accountIndex;
    const blockchain = state.ui.screens.posActions.quickDelegateEnterAmount.blockchain;
    return {
        account: getAccount(state, accountIndex, blockchain),
        chainId: getChainId(state, blockchain),
        accountIndex,
        blockchain,
        token: state.ui.screens.posActions.quickDelegateEnterAmount.token,
        validators: state.ui.screens.posActions.quickDelegateEnterAmount.validators,
        actionText: state.ui.screens.posActions.quickDelegateEnterAmount.actionText
    };
};

const mapDispatchToProps = {
    //
};

interface IState {
    validatorsList: IValidator[];
    amount: string;
    insufficientFunds: boolean;
    feeOptions: IFeeOptions;
    insufficientFundsFees: boolean;
}

export const navigationOptions = ({ navigation }: any) => ({
    title: navigation?.state?.params?.actionText && translate(navigation?.state?.params?.actionText)
});

export class QuickDelegateEnterAmountComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            validatorsList: props.validators,
            amount: '',
            insufficientFunds: false,
            feeOptions: undefined,
            insufficientFundsFees: false
        };
    }

    public componentDidMount() {
        this.props.navigation.setParams({ actionText: this.props.actionText });
    }

    private renderBottomConfirm() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        const selectedValidators = this.state.validatorsList.filter(
            validator => validator.actionTypeSelected === true
        );
        let valuePrimaryCtaField = '';
        if (selectedValidators.length > 1) {
            valuePrimaryCtaField =
                selectedValidators.length + ' ' + translate('App.labels.validators').toLowerCase();
        } else if (selectedValidators.length === 1) {
            valuePrimaryCtaField = selectedValidators[0].name;
        }

        let disableButton: boolean;
        if (
            this.state.amount === '' ||
            this.state.insufficientFunds ||
            this.state.insufficientFundsFees ||
            isNaN(Number(this.state.feeOptions?.gasLimit)) === true ||
            isNaN(Number(this.state.feeOptions?.gasPrice))
        )
            disableButton = true;

        return (
            <BottomCta
                label={translate('App.labels.next')}
                disabled={disableButton}
                onPress={() => {
                    // navigate to next screen
                }}
            >
                <PrimaryCtaField
                    label={translate(this.props.actionText)}
                    action={translate('App.labels.for').toLowerCase()}
                    value={valuePrimaryCtaField}
                />
                <AmountCtaField
                    tokenConfig={tokenConfig}
                    stdAmount={new BigNumber(this.state.amount)}
                    account={this.props.account}
                />
            </BottomCta>
        );
    }

    private renderValidatorList() {
        const spliAmountToEachValidator = new BigNumber(this.state.amount || 0).dividedBy(
            this.state.validatorsList.length
        );
        return this.state.validatorsList.map((validator, index) => (
            <ValidatorDelegateAmount
                key={index}
                validator={validator}
                amount={spliAmountToEachValidator.toString()}
                symbol={this.props.token.symbol}
            />
        ));
    }

    //////////////////////////

    public onFeesChanged(feeOptions: IFeeOptions) {
        this.setState({ feeOptions }, () => this.availableFunds());
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

    private getInputAmountToStd(): BigNumber {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);

        return blockchainInstance.account.amountToStd(
            new BigNumber(this.state.amount ? this.state.amount : 0),
            tokenConfig.decimals
        );
    }

    public addAmount(value: string) {
        const amount = value.replace(/,/g, '.');
        this.setState({ amount }, () => this.availableFunds());
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
                    toAddress={''}
                    onFeesChanged={(feeOptions: IFeeOptions) => this.onFeesChanged(feeOptions)}
                    insufficientFundsFees={this.state.insufficientFundsFees}
                />
            </View>
        );
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
                    {this.renderEnterAmount()}
                    <View style={styles.content}>{this.renderValidatorList()}</View>
                </KeyboardAwareScrollView>

                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const QuickDelegateEnterAmount = smartConnect(QuickDelegateEnterAmountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
