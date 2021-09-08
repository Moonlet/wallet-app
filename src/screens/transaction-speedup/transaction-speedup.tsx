import React from 'react';
import { View, ScrollView } from 'react-native';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Button, Text } from '../../library';
import { translate } from '../../core/i18n';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState } from '../../redux/wallets/state';
import { formatAddress } from '../../core/utils/format-address';
import {
    Blockchain,
    ChainIdType,
    IBlockchainTransaction,
    IFeeOptions,
    TransactionType
} from '../../core/blockchain/types';
import { getAccount, getSelectedAccountTransaction } from '../../redux/wallets/selectors';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

import { removeTransaction, updateTransactionFromBlockchain } from '../../redux/wallets/actions';
import { Capitalize } from '../../core/utils/format-string';
import { Amount } from '../../components/amount/amount';
import { TokenType } from '../../core/blockchain/types/token';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { getChainId } from '../../redux/preferences/selectors';
import { FeeOptions } from '../send/components/fee-options/fee-options';
import { availableFunds } from '../../core/utils/available-funds';

interface IReduxProps {
    account: IAccountState;
    txRedux: IBlockchainTransaction;
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
    removeTransaction: typeof removeTransaction;
    chainId: ChainIdType;
}

interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    transaction: IBlockchainTransaction;
}

const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        txRedux: getSelectedAccountTransaction(state, ownProps.transaction.id),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    updateTransactionFromBlockchain,
    removeTransaction
};

interface IState {
    transaction: IBlockchainTransaction;
    insufficientFundsFees: boolean;
    feeOptions: IFeeOptions;
    errorMessage: {
        message: string;
    };
}

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => <HeaderLeftClose navigation={navigation} />,
    title: translate('Transaction.transactionSpeedup')
});

class TransactionSpeedupComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>> &
        IReduxProps,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps<INavigationParams> &
            IThemeProps<ReturnType<typeof stylesProvider>> &
            IReduxProps
    ) {
        super(props);

        this.state = {
            insufficientFundsFees: false,
            feeOptions: props.transaction.feeOptions,
            transaction: props.transaction,
            errorMessage: undefined
        };
    }

    // private async calculateAvailableAmount() {
    //     const amount = await availableAmount(
    //         this.props.account,
    //         this.props.account.tokens[this.props.chainId][this.props.transaction.token.symbol],
    //         this.props.chainId,
    //         { feeOptions: this.state.feeOptions }
    //     );

    //     this.setState({ availableAmount: amount });
    // }

    public onFeesChanged(feeOptions: IFeeOptions) {
        this.setState({ feeOptions }, () => {
            // this.calculateAvailableAmount();

            const blockchainInstance = getBlockchain(this.props.account.blockchain);
            const amount = blockchainInstance.transaction.getTransactionAmount(
                this.props.transaction
            );

            const { insufficientFundsFees } = availableFunds(
                amount,
                this.props.account,
                this.props.account.tokens[this.props.chainId][this.props.transaction.token.symbol],
                this.props.chainId,
                feeOptions
            );

            this.setState({ insufficientFundsFees });
        });
    }

    private renderRow(title: string, body: string) {
        const { styles } = this.props;

        return (
            <View style={styles.rowContainer}>
                <Text style={styles.textPrimary}>{title}</Text>
                <Text style={styles.textSecondary}>{body}</Text>
            </View>
        );
    }

    public async confirmPayment() {
        //
    }
    public render() {
        const { account, styles } = this.props;
        const { transaction } = this.state;

        const blockchain = account.blockchain;

        const blockchainInstance = getBlockchain(blockchain);
        const coin = blockchainInstance.config.coin;
        const amount = blockchainInstance.transaction.getTransactionAmount(transaction);

        const tokenConfig = getTokenConfig(blockchain, transaction?.token?.symbol || coin);
        const tokenType = transaction?.token?.type;

        let recipient =
            tokenType === TokenType.ZRC2 || tokenType === TokenType.ERC20
                ? formatAddress(transaction.data.params[0], blockchain)
                : formatAddress(transaction.toAddress, blockchain);

        if (transaction?.additionalInfo?.validatorName) {
            recipient = transaction.additionalInfo.validatorName;
        }

        let transactionType = translate('App.labels.transfer');

        if (transaction.type === TransactionType.CONTRACT_DEPLOY) {
            transactionType = translate('App.labels.contractDeploy');
        }

        if (transaction.type === TransactionType.CONTRACT_CALL) {
            transactionType =
                translate('App.labels.contractCall') + ` (${Capitalize(transaction.data.method)})`;
        }

        if (tokenType === TokenType.ZRC2 || tokenType === TokenType.ERC20) {
            transactionType = Capitalize(transaction.data.method);
            if (!!transaction.additionalInfo?.swap) {
                transactionType = translate(`ContractMethod.${transaction.data.method}`);
            }
        }

        if (transaction?.additionalInfo?.posAction) {
            transactionType = Capitalize(transaction.additionalInfo.posAction)
                .split('_')
                .join(' ');
        }

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollConainter}
                    showsVerticalScrollIndicator={false}
                >
                    {this.renderRow(transactionType, translate('Transaction.transactionType'))}

                    <View style={styles.rowContainer}>
                        <Amount
                            style={styles.textPrimary}
                            amount={amount}
                            blockchain={blockchain}
                            token={transaction?.token?.symbol || coin}
                            tokenDecimals={tokenConfig.decimals}
                        />
                        <Text style={styles.textSecondary}>{translate('Send.amount')}</Text>
                    </View>

                    {this.renderRow(
                        formatAddress(transaction.address, account.blockchain),
                        translate('App.labels.sender')
                    )}
                    {this.renderRow(recipient, translate('App.labels.recipient'))}
                    <Text style={styles.textPrimary}>{translate('App.labels.fees')}</Text>

                    <FeeOptions
                        transactionType={this.props.transaction.type}
                        token={
                            this.props.account.tokens[this.props.chainId][
                                this.props.transaction.token.symbol
                            ]
                        }
                        // TO BE SURE - is this ok guys?
                        sendingToken={
                            this.props.account.tokens[this.props.chainId][
                                this.props.transaction.token.symbol
                            ]
                        }
                        account={this.props.account}
                        toAddress={this.props.transaction.toAddress}
                        onFeesChanged={(feeOptions: IFeeOptions) => this.onFeesChanged(feeOptions)}
                        insufficientFundsFees={this.state.insufficientFundsFees}
                    />
                    <Button
                        primary
                        onPress={this.confirmPayment}
                        wrapperStyle={styles.signButton}
                        disabled={false}
                    >
                        {translate('Transaction.signTransaction')}
                    </Button>
                </ScrollView>
            </View>
        );
    }
}

export const TransactionSpeedup = smartConnect(TransactionSpeedupComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
