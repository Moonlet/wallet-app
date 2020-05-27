import React from 'react';
import { View } from 'react-native';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { withNavigationParams, INavigationProps } from '../../../navigation/with-navigation-params';
import { getAccount } from '../../../redux/wallets/selectors';
import { Blockchain, ChainIdType, IFeeOptions } from '../../../core/blockchain/types';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';
import { TestnetBadge } from '../../../components/testnet-badge/testnet-badge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { getChainId } from '../../../redux/preferences/selectors';
import { IValidator } from '../../../core/blockchain/types/stats';
import { BottomCta } from '../../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../components/bottom-cta/amount-cta-field/amount-cta-field';
import {
    getInputAmountToStd,
    availableFunds,
    availableAmount
} from '../../../core/utils/available-funds';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { EnterAmount } from '../../send/components/enter-amount/enter-amount';
import { FeeOptions } from '../../send/components/fee-options/fee-options';

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
    validators: IValidator[];
    actionText: string;
}

interface IState {
    amount: string;
    insufficientFunds: boolean;
    feeOptions: IFeeOptions;
    insufficientFundsFees: boolean;
}

export const navigationOptions = ({ navigation }: any) => ({
    title: translate(navigation.state.params.actionText || 'App.labels.send')
});
export class PosActionUnlockComponent extends React.Component<
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

        this.state = {
            amount: '',
            insufficientFunds: false,
            feeOptions: undefined,
            insufficientFundsFees: false
        };
    }

    private renderBottomConfirm() {
        const { theme } = this.props;
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

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
                label={translate('App.labels.confirm')}
                disabled={disableButton}
                onPress={() => {
                    // navigate to next screen
                }}
            >
                <PrimaryCtaField
                    label={translate(this.props.actionText)}
                    labelColor={theme.colors.unlocking}
                    action={translate('App.labels.from').toLowerCase()}
                    value={this.props.validators[0].name}
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

    public onFeesChanged(feeOptions: IFeeOptions) {
        this.setState({ feeOptions }, () => {
            const { insufficientFunds, insufficientFundsFees } = availableFunds(
                this.state.amount,
                this.props.account,
                this.props.token,
                this.props.chainId,
                feeOptions,
                this.props.validators[0].amountDelegated
            );

            this.setState({ insufficientFunds, insufficientFundsFees });
        });
    }

    public addAmount(value: string) {
        const amount = value.replace(/,/g, '.');
        this.setState({ amount }, () => {
            const { insufficientFunds, insufficientFundsFees } = availableFunds(
                amount,
                this.props.account,
                this.props.token,
                this.props.chainId,
                this.state.feeOptions,
                this.props.validators[0].amountDelegated
            );

            this.setState({ insufficientFunds, insufficientFundsFees });
        });
    }

    private renderEnterAmount() {
        const config = getBlockchain(this.props.account.blockchain).config;

        return (
            <View key="enterAmount" style={this.props.styles.amountContainer}>
                <EnterAmount
                    availableAmount={availableAmount(
                        this.props.account,
                        this.props.token,
                        this.state.feeOptions,
                        this.props.validators[0].amountDelegated
                    )}
                    value={this.state.amount}
                    insufficientFunds={this.state.insufficientFunds}
                    token={this.props.token}
                    account={this.props.account}
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
        const { styles, theme } = this.props;
        const map = [
            {
                text: translate('Validator.unlockText1')
            },
            {
                text: translate('Validator.unlockText2'),
                style: { color: theme.colors.unlocking }
            },
            {
                text: translate('Validator.unlockText3')
            },
            {
                text: translate('Validator.unlockText4'),
                style: { color: theme.colors.notVoting }
            },
            {
                text: translate('Validator.unlockText5')
            }
        ];

        return (
            <View style={styles.container}>
                <TestnetBadge />

                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={styles.content}>
                        <View>
                            <View>
                                <Text style={styles.unlockContainerText}>
                                    {map.map((value, index) => {
                                        return (
                                            <Text
                                                key={index}
                                                style={[styles.unlockTextChildren, value?.style]}
                                            >
                                                {value.text + ' '}
                                            </Text>
                                        );
                                    })}
                                </Text>

                                {this.renderEnterAmount()}
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const PosActionUnlock = smartConnect(PosActionUnlockComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
