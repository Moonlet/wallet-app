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
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { EnterAmountComponent } from '../../components/enter-amount-component/enter-amount-component';
import { bind } from 'bind-decorator';
import { delegate } from '../../../../redux/wallets/actions';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import BigNumber from 'bignumber.js';
import { PosBasicActionType } from '../../../../core/blockchain/types/token';
import { Dialog } from '../../../../components/dialog/dialog';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    actionText: string;
    delegate: typeof delegate;
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
    delegate
};

interface IState {
    loading: boolean;
    amount: string;
    minimumDelegateAmount: BigNumber;
    minimumAmountToKeep: BigNumber;
    tokenSymbol: string;
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
            loading: true,
            amount: undefined,
            minimumDelegateAmount: undefined,
            minimumAmountToKeep: undefined,
            tokenSymbol: undefined
        };
    }

    public async componentDidMount() {
        this.props.navigation.setParams({ actionText: this.props.actionText });

        const blockchainInstance = getBlockchain(this.props.blockchain);
        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);
        const config = blockchainInstance.config;

        try {
            this.setState({ loading: true });

            let validator;
            if (this.props.validators.length === 1) {
                validator = this.props.validators[0];
            }

            const data = await blockchainInstance
                .getStats(this.props.chainId)
                .getAvailableBalanceForDelegate(this.props.account, validator?.id);

            const response = await blockchainInstance
                .getClient(this.props.chainId)
                .getMinimumAmountDelegate();

            const minimumDelegateAmountValue = blockchainInstance.account.amountFromStd(
                new BigNumber(response),
                tokenConfig.decimals
            );

            this.setState({
                minimumAmountToKeep: blockchainInstance.account.amountFromStd(
                    config.amountToKeepInAccount[this.props.account.type],
                    tokenConfig.decimals
                ),
                tokenSymbol: tokenConfig.symbol
            });

            this.setState({
                minimumDelegateAmount:
                    minimumDelegateAmountValue.multipliedBy(this.props.validators.length) ||
                    new BigNumber(0),
                amount: blockchainInstance.account
                    .amountFromStd(new BigNumber(data), tokenConfig.decimals)
                    .toFixed(tokenConfig.ui.decimals, BigNumber.ROUND_DOWN)
            });
        } catch (err) {
            const amount = blockchainInstance.account
                .amountFromStd(new BigNumber(this.props.token.balance.value), tokenConfig.decimals)
                .toFixed(tokenConfig.ui.decimals, BigNumber.ROUND_DOWN);

            this.setState({ amount }); // set balance to the available balance at least
            SentryCaptureException(new Error(JSON.stringify(err)));
        }

        const performAction: { value: boolean; message: string } = await getBlockchain(
            this.props.blockchain
        )
            .getClient(this.props.chainId)
            .canPerformAction(PosBasicActionType.DELEGATE, {
                account: this.props.account,
                validatorAddress: Object.values(this.props.validators).map(value =>
                    value.id.toLowerCase()
                )
            });
        this.setState({ loading: false });

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
    }

    @bind
    private async onPressConfirm(amount: string, feeOptions: IFeeOptions) {
        this.props.delegate(
            this.props.account,
            amount,
            this.props.validators,
            this.props.token.symbol,
            feeOptions,
            undefined
        );
    }

    public render() {
        if (this.state.loading) {
            return (
                <View style={this.props.styles.container}>
                    <LoadingIndicator />
                </View>
            );
        } else {
            return (
                <EnterAmountComponent
                    account={this.props.account}
                    chainId={this.props.chainId}
                    token={this.props.token}
                    balanceForDelegate={this.state.amount}
                    validators={this.props.validators}
                    actionText={this.props.actionText}
                    bottomColor={this.props.theme.colors.accent}
                    bottomActionText={'App.labels.for'}
                    bottomButtonText={'App.labels.confirm'}
                    showSteps={false}
                    minimumDelegateAmount={this.state.minimumDelegateAmount}
                    allBalanceNotice={translate(
                        `Validator.allBalanceNotice.${this.props.blockchain}`,
                        {
                            amount: this.state.minimumAmountToKeep
                                ? this.state.minimumAmountToKeep?.toFixed()
                                : '0',
                            token: this.state.tokenSymbol
                        }
                    )}
                    onPressNext={this.onPressConfirm}
                />
            );
        }
    }
}

export const QuickDelegateEnterAmount = smartConnect(QuickDelegateEnterAmountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
