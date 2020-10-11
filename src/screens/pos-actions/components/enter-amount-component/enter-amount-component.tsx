import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { translate } from '../../../../core/i18n';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { ChainIdType, IFeeOptions } from '../../../../core/blockchain/types';
import BigNumber from 'bignumber.js';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { TestnetBadge } from '../../../../components/testnet-badge/testnet-badge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { HeaderStepByStep } from '../../../send/components/header-step-by-step/header-step-by-step';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { BottomCta } from '../../../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../../components/bottom-cta/amount-cta-field/amount-cta-field';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { ValidatorDelegateAmount } from '../../components/validator-delegate-amount/validator-delegate-amount';
import {
    getInputAmountToStd,
    availableFunds,
    availableAmount
} from '../../../../core/utils/available-funds';
import { EnterAmount } from '../../../send/components/enter-amount/enter-amount';
import { valuePrimaryCtaField } from '../../../../core/utils/format-string';
import { splitStake } from '../../../../core/utils/balance';

interface IHeaderStep {
    step: number;
    title: string;
    active: boolean;
}

export interface IProps {
    account: IAccountState;
    chainId: ChainIdType;
    token: ITokenState;
    validators: IValidator[];
    actionText: string;
    bottomColor: string;
    bottomActionText: string;
    bottomButtonText: string;
    showSteps: boolean;
    fromValidator?: IValidator;
    balanceForDelegate: string;
    minimumDelegateAmount: BigNumber;
    allBalanceNotice?: string;
    onPressNext(amount: string, feeOptions: IFeeOptions): void;
}

interface IState {
    headerSteps: IHeaderStep[];
    amount: string;
    insufficientFunds: boolean;
    insufficientMinimumAmount: boolean;
    insufficientFundsFees: boolean;
}

export class EnterAmountComponentComponent extends React.Component<
    INavigationProps & IProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: INavigationProps & IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        const stepList = [];
        if (props.showSteps) {
            const blockchainInstance = getBlockchain(props.account.blockchain);
            blockchainInstance.config.ui.token.sendStepLabels.map((step, index) => {
                stepList.push({
                    step: index,
                    title: translate(step),
                    active: index === 1 ? true : false
                });
            });
        }

        this.state = {
            headerSteps: stepList,
            amount: '',
            insufficientFunds: false,
            insufficientFundsFees: false,
            insufficientMinimumAmount: false
        };
    }

    private renderBottomConfirm() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        let disableButton: boolean;
        if (
            this.state.amount === '' ||
            this.state.insufficientFunds ||
            this.state.insufficientFundsFees ||
            this.state.insufficientMinimumAmount
        )
            disableButton = true;

        const textPrimaryCtaField = this.props.fromValidator
            ? valuePrimaryCtaField([this.props.fromValidator])
            : valuePrimaryCtaField(this.props.validators);

        return (
            <BottomCta
                label={translate(this.props.bottomButtonText)}
                disabled={disableButton}
                onPress={() => {
                    this.props.onPressNext(this.state.amount, {});
                }}
            >
                <PrimaryCtaField
                    label={translate(this.props.actionText)}
                    labelColor={this.props.bottomColor}
                    action={translate(this.props.bottomActionText).toLowerCase()}
                    value={textPrimaryCtaField}
                />
                <AmountCtaField
                    tokenConfig={tokenConfig}
                    stdAmount={getInputAmountToStd(
                        this.props.account,
                        this.props.token,
                        this.state.amount
                    )}
                    account={this.props.account}
                />
            </BottomCta>
        );
    }

    private renderValidatorList() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const stdAmount = blockchainInstance.account.amountToStd(
            this.state.amount || 0,
            tokenConfig.decimals
        );
        const splitAmount = splitStake(stdAmount, this.props.validators.length);
        const amountFromStd = blockchainInstance.account.amountFromStd(
            splitAmount,
            tokenConfig.decimals
        );

        return this.props.validators.map((validator, index) => (
            <ValidatorDelegateAmount
                key={index}
                validator={validator}
                amount={amountFromStd.toFixed(2, BigNumber.ROUND_DOWN)}
                symbol={this.props.token.symbol}
            />
        ));
    }

    public addAmount(value: string) {
        const amount = value.replace(/,/g, '.');
        this.setState({ amount }, () => {
            const { insufficientFunds, insufficientFundsFees } = availableFunds(
                amount,
                this.props.account,
                this.props.token,
                this.props.chainId,
                { feeTotal: '0' },
                this.props.balanceForDelegate
            );

            let insufficientMinimumAmount = false;

            if (
                this.props.minimumDelegateAmount &&
                new BigNumber(this.props.minimumDelegateAmount).isGreaterThan(amount)
            )
                insufficientMinimumAmount = true;

            this.setState({ insufficientFunds, insufficientFundsFees, insufficientMinimumAmount });
        });
    }

    private renderEnterAmount() {
        // const blockchainInstance = getBlockchain(this.props.account.blockchain);
        return (
            <View key="enterAmount" style={this.props.styles.amountContainer}>
                <EnterAmount
                    availableAmount={availableAmount(
                        this.props.account,
                        this.props.token,
                        undefined, // removed fee options, we have a minimum amount that we keep in account, for future transactions
                        this.props.balanceForDelegate
                    )}
                    value={this.state.amount}
                    insufficientFunds={this.state.insufficientFunds}
                    insufficientFundsNotice={this.props.allBalanceNotice}
                    insufficientMinimumAmount={this.state.insufficientMinimumAmount}
                    token={this.props.token}
                    account={this.props.account}
                    minimumAmount={
                        this.props.minimumDelegateAmount
                            ? this.props.minimumDelegateAmount.toFixed()
                            : '0'
                    }
                    onChange={amount => this.addAmount(amount)}
                />
            </View>
        );
    }

    public render() {
        const { styles, showSteps } = this.props;
        return (
            <View style={styles.container}>
                <TestnetBadge />

                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={styles.content}>
                        {showSteps && (
                            <View style={styles.headerSteps}>
                                <HeaderStepByStep steps={this.state.headerSteps} />
                            </View>
                        )}
                        {this.renderEnterAmount()}
                        {this.renderValidatorList()}
                    </View>
                </KeyboardAwareScrollView>

                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const EnterAmountComponent = smartConnect<IProps>(EnterAmountComponentComponent, [
    withTheme(stylesProvider)
]);
