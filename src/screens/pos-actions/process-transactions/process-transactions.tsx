import React from 'react';
import { View } from 'react-native';
import { Text, Button } from '../../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { smartConnect } from '../../../core/utils/smart-connect';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { translate } from '../../../core/i18n';
import Icon from '../../../components/icon/icon';
import { IconValues } from '../../../components/icon/values';
import { normalize } from '../../../styles/dimensions';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';
import { closeProcessTransactions } from '../../../redux/ui/process-transactions/actions';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { IBlockchainTransaction } from '../../../core/blockchain/types';
import { TransactionStatus, WalletType } from '../../../core/wallet/types';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import BigNumber from 'bignumber.js';
import { formatNumber } from '../../../core/utils/format-number';
import { getSelectedWallet } from '../../../redux/wallets/selectors';

export interface IReduxProps {
    isVisible: boolean;
    transactions: IBlockchainTransaction[];
    closeProcessTransactions: typeof closeProcessTransactions;
    walletType: WalletType;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.processTransactions.isVisible,
        transactions: state.ui.processTransactions.data.txs,
        walletType: getSelectedWallet(state)?.type
    };
};

const mapDispatchToProps = {
    closeProcessTransactions
};

export class ProcessTransactionsComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    private renderCard(tx: IBlockchainTransaction, index: number) {
        const { styles, theme } = this.props;
        const status = tx.status;
        const tokenConfig = getTokenConfig(tx.blockchain, tx.token.symbol);
        const blockchainInstance = getBlockchain(tx.blockchain);
        const fees = blockchainInstance.account.amountFromStd(
            new BigNumber(tx.feeOptions.feeTotal),
            tokenConfig.decimals
        );
        let amountString = tx.amount;

        if (amountString === '0') {
            amountString = tx.data.params.length > 1 ? tx.data.params[1] : tx.data.params[0];
        }

        const amount = blockchainInstance.account.amountFromStd(
            new BigNumber(amountString),
            tokenConfig.decimals
        );

        let leftIcon = '';
        let rightText = '';
        let iconColor = '';

        switch (status) {
            case TransactionStatus.FAILED: {
                leftIcon = IconValues.FAILED;
                rightText = translate('App.labels.failed');
                iconColor = theme.colors.disabledButton;
                break;
            }
            case TransactionStatus.SUCCESS: {
                leftIcon = IconValues.VOTE;
                iconColor = theme.colors.accent;
                break;
            }
            case TransactionStatus.DROPPED: {
                leftIcon = IconValues.FAILED;
                rightText = translate('App.labels.canceled');
                iconColor = theme.colors.disabledButton;
                break;
            }
            case TransactionStatus.PENDING: {
                leftIcon = IconValues.PENDING;
                iconColor = theme.colors.warning;
                break;
            }
            default: {
                leftIcon = IconValues.PENDING;
                rightText = '';
                iconColor = theme.colors.warning;
            }
        }

        return (
            <View key={index + '-view-key'} style={styles.cardContainer}>
                <Icon
                    name={leftIcon}
                    size={normalize(30)}
                    style={[
                        styles.cardLeftIcon,
                        {
                            color: iconColor
                        }
                    ]}
                />

                <View style={styles.cardTextContainer}>
                    <Text style={styles.topText}>
                        {formatNumber(new BigNumber(amount), {
                            currency: blockchainInstance.config.coin
                        })}
                    </Text>
                    <Text style={styles.middleText}>{tx.additionalInfo.posAction}</Text>
                    <Text style={styles.bottomText}>
                        {translate('App.labels.fees') +
                            ': ' +
                            formatNumber(new BigNumber(fees), {
                                currency: blockchainInstance.config.coin
                            })}
                    </Text>
                </View>

                {status === TransactionStatus.PENDING && (
                    <View>
                        <LoadingIndicator />
                    </View>
                )}

                {status === TransactionStatus.SUCCESS ? (
                    <Icon name={IconValues.CHECK} size={normalize(16)} style={styles.successIcon} />
                ) : (
                    <Text style={styles.failedText}>{rightText}</Text>
                )}
            </View>
        );
    }

    public render() {
        const { styles } = this.props;

        // let disableButton =
        //     this.props.transactions.filter(tx => tx.status === TransactionStatus.PENDING).length >
        //         0 || this.props.transactions.length === 0;

        // disableButton =
        //     this.props.transactions.filter(tx => tx.status === TransactionStatus.FAILED).length ===
        //     0
        //         ? false
        //         : true;

        const title =
            this.props.walletType === WalletType.HW
                ? translate('Transaction.processTitleTextLedger')
                : translate('Transaction.processTitleText');

        if (this.props.isVisible) {
            return (
                <View style={styles.container}>
                    <Text style={styles.screenTitle}>{translate('App.labels.processing')}</Text>

                    <Text style={styles.title}>{title}</Text>

                    {this.props.transactions.length ? (
                        <View style={styles.content}>
                            {this.props.transactions.map((tx, index) => {
                                return this.renderCard(tx, index);
                            })}
                        </View>
                    ) : (
                        <LoadingIndicator />
                    )}

                    <Button
                        primary
                        onPress={() => {
                            this.props.closeProcessTransactions();
                        }}
                        wrapperStyle={styles.continueButton}
                        disabled={false} // TODO - based on transaction statuses
                    >
                        {translate('App.labels.continue')}
                    </Button>
                </View>
            );
        } else {
            return null;
        }
    }
}

export const ProcessTransactions = smartConnect(ProcessTransactionsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
