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
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';
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
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { unlock, unvote, unstake, claimRewardNoInput } from '../../../redux/wallets/actions';
import { valuePrimaryCtaField } from '../../../core/utils/format-string';
import BigNumber from 'bignumber.js';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';
import { Dialog } from '../../../components/dialog/dialog';

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    unlock: typeof unlock;
    unvote: typeof unvote;
    unstake: typeof unstake;
    claimRewardNoInput: typeof claimRewardNoInput;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    unlock,
    unvote,
    unstake,
    claimRewardNoInput
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    actionText: string;
    basicAction: PosBasicActionType;
    unlockDuration?: string;
}

interface IState {
    amount: string;
    insufficientFunds: boolean;
    insufficientFundsFees: boolean;
    availableAmount: string;
}

export const navigationOptions = ({ navigation }: any) => ({
    title: translate(navigation.state.params.actionText || 'App.labels.send')
});
export class PosBasicActionComponent extends React.Component<
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
            insufficientFundsFees: false,
            availableAmount: '0'
        };

        if (props.basicAction === PosBasicActionType.CLAIM_REWARD_NO_INPUT) {
            this.onPressConfirm();
        }
    }

    public async componentDidMount() {
        const blockchainInstance = getBlockchain(this.props.blockchain);

        const performAction: {
            value: boolean;
            message: string;
        } = await blockchainInstance
            .getClient(this.props.chainId)
            .canPerformAction(this.props.basicAction, {
                account: this.props.account,
                validatorAddress: Object.values(this.props.validators).map(value =>
                    value.id.toLowerCase()
                )
            });
        if (performAction && performAction.value === false) {
            Dialog.alert(
                translate('Validator.operationNotAvailable'),
                performAction.message,
                undefined,
                {
                    text: translate('App.labels.ok'),
                    onPress: () => this.props.navigation.goBack()
                }
            );
        }

        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);

        const activeBalance = blockchainInstance.account
            .amountFromStd(
                new BigNumber(this.props.validators[0].amountDelegated.active),
                tokenConfig.decimals
            )
            .toFixed();

        const amount = await availableAmount(
            this.props.account,
            this.props.token,
            this.props.chainId,
            undefined,
            activeBalance
        );

        this.setState({ availableAmount: amount });
    }

    private async onPressConfirm() {
        switch (this.props.basicAction) {
            case PosBasicActionType.UNLOCK: {
                this.props.unlock(
                    this.props.account,
                    this.state.amount,
                    this.props.token.symbol,
                    undefined,
                    undefined
                );
                break;
            }
            case PosBasicActionType.UNVOTE: {
                this.props.unvote(
                    this.props.account,
                    this.state.amount,
                    this.props.validators,
                    this.props.token.symbol,
                    undefined,
                    undefined
                );
                break;
            }
            case PosBasicActionType.UNSTAKE: {
                const blockchainInstance = getBlockchain(this.props.account.blockchain);
                const tokenConfig = getTokenConfig(
                    this.props.account.blockchain,
                    this.props.token.symbol
                );
                const performAction = await blockchainInstance
                    .getClient(this.props.chainId)
                    .hasEnoughAmountToMakeAction(PosBasicActionType.UNSTAKE, {
                        fromValidator: this.props.validators[0],
                        account: this.props.account,
                        tokenConfig,
                        toValidators: [],
                        amount: this.state.amount
                    });
                if (performAction && performAction.value === false) {
                    Dialog.alert(
                        translate('Validator.minimumUnstakeTitle'),
                        performAction.message,
                        undefined,
                        {
                            text: translate('App.labels.ok'),
                            onPress: () => {
                                this.setState({ amount: '' });
                            }
                        }
                    );
                } else {
                    this.props.unstake(
                        this.props.account,
                        this.state.amount,
                        this.props.validators,
                        this.props.token.symbol,
                        undefined,
                        undefined
                    );
                }
                break;
            }
            case PosBasicActionType.CLAIM_REWARD_NO_INPUT: {
                this.props.claimRewardNoInput(
                    this.props.account,
                    this.props.validators,
                    this.props.token.symbol,
                    undefined
                );
                setTimeout(() => this.props.navigation.goBack(), 500);

                break;
            }
        }
    }

    private renderBottomConfirm() {
        const { theme } = this.props;
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        let labelColor: string;

        switch (this.props.basicAction) {
            case PosBasicActionType.UNLOCK:
            case PosBasicActionType.WITHDRAW: {
                labelColor = theme.colors.labelRedelegate;
                break;
            }
            case PosBasicActionType.UNVOTE:
            case PosBasicActionType.UNDELEGATE:
            case PosBasicActionType.UNSTAKE: {
                labelColor = theme.colors.labelUndelegate;
                break;
            }
            case PosBasicActionType.CLAIM_REWARD:
            case PosBasicActionType.CLAIM_REWARD_NO_INPUT: {
                labelColor = theme.colors.labelReward;
                break;
            }
            case PosBasicActionType.REINVEST: {
                labelColor = theme.colors.accent;
                break;
            }
            default: {
                labelColor = theme.colors.labelReward;
                break;
            }
        }

        let disableButton: boolean;
        if (
            this.state.amount === '' ||
            this.state.insufficientFunds ||
            this.state.insufficientFundsFees
        )
            disableButton = true;

        return (
            <BottomCta
                label={translate('App.labels.confirm')}
                disabled={disableButton}
                onPress={() => {
                    this.onPressConfirm();
                }}
            >
                <PrimaryCtaField
                    label={translate(this.props.actionText)}
                    labelColor={labelColor}
                    action={translate('App.labels.from').toLowerCase()}
                    value={valuePrimaryCtaField(this.props.validators)}
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

    public addAmount(value: string) {
        const amount = value.replace(/,/g, '.');
        const blockchainInstance = getBlockchain(this.props.blockchain);

        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);

        const activeBalance = blockchainInstance.account
            .amountFromStd(
                new BigNumber(this.props.validators[0].amountDelegated.active),
                tokenConfig.decimals
            )
            .toFixed();
        this.setState({ amount }, () => {
            const { insufficientFunds, insufficientFundsFees } = availableFunds(
                amount,
                this.props.account,
                this.props.token,
                this.props.chainId,
                undefined,
                activeBalance
            );

            this.setState({ insufficientFunds, insufficientFundsFees });
        });
    }

    private renderEnterAmount() {
        return (
            <View key="enterAmount" style={this.props.styles.amountContainer}>
                <EnterAmount
                    availableAmount={this.state.availableAmount}
                    value={this.state.amount}
                    insufficientMinimumAmount={false}
                    insufficientFunds={this.state.insufficientFunds}
                    token={this.props.token}
                    account={this.props.account}
                    minimumAmount={'0.001'}
                    onChange={amount => this.addAmount(amount)}
                />
            </View>
        );
    }

    public renderUnlockTopText() {
        const { styles, theme } = this.props;
        const map = [
            {
                text: translate('Validator.unlockText1')
            },
            {
                text: translate('Validator.unlockText2'),
                style: { color: theme.colors.labelRedelegate }
            },
            {
                text: translate('Validator.unlockText3')
            },
            {
                text: translate('Validator.unlockText4'),
                style: { color: theme.colors.labelUndelegate }
            },
            {
                text: translate('Validator.unlockText5')
            }
        ];

        return (
            <Text style={styles.unlockContainerText}>
                {map.map((value, index) => {
                    return (
                        <Text key={index} style={[styles.unlockTextChildren, value?.style]}>
                            {value.text + ' '}
                        </Text>
                    );
                })}
            </Text>
        );
    }

    public render() {
        const { styles } = this.props;

        const config = getBlockchain(this.props.blockchain).config;

        if (this.props.basicAction === PosBasicActionType.CLAIM_REWARD_NO_INPUT)
            return (
                <View style={styles.container}>
                    <LoadingIndicator />
                </View>
            );

        return (
            <View style={styles.container}>
                <TestnetBadge />

                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={styles.content}>
                        {this.props.basicAction === PosBasicActionType.UNLOCK &&
                            this.renderUnlockTopText()}
                        <View>{this.renderEnterAmount()}</View>
                    </View>
                </KeyboardAwareScrollView>

                <View style={{ flex: 1 }}>
                    {this.props.basicAction ===
                        (PosBasicActionType.UNDELEGATE || PosBasicActionType.UNLOCK) && (
                        <Text style={styles.bottomText}>
                            {translate('Validator.unlockBottomText', {
                                duration: this.props.unlockDuration || '3 days'
                            })}
                        </Text>
                    )}
                    {this.props.basicAction === PosBasicActionType.UNSTAKE &&
                        config.ui.token.actionScreenLabels[
                            PosBasicActionType.UNSTAKE.toLowerCase()
                        ] && (
                            <Text style={styles.bottomText}>
                                {translate(
                                    config.ui.token.actionScreenLabels[
                                        PosBasicActionType.UNSTAKE.toLowerCase()
                                    ]
                                )}
                            </Text>
                        )}
                    {this.props.basicAction === PosBasicActionType.CLAIM_REWARD && (
                        <Text style={styles.bottomText}>
                            {translate('Validator.claimRewardBottomText')}
                        </Text>
                    )}

                    {this.renderBottomConfirm()}
                </View>
            </View>
        );
    }
}

export const PosBasicAction = smartConnect(PosBasicActionComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
