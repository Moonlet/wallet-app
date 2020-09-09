import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { translate } from '../../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { formatAddress } from '../../../core/utils/format-address';
import { FeeTotal } from '../../send/components/fee-total/fee-total';
import { BottomCta } from '../../../components/bottom-cta/bottom-cta';
import { Text, Button } from '../../../library';
import { getSelectedWallet, getWalletByPubKey } from '../../../redux/wallets/selectors';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { IBlockchainTransaction, TransactionType } from '../../../core/blockchain/types';
import { IAccountState } from '../../../redux/wallets/state';
import { NotificationType } from '../../../core/messaging/types';
import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { PrimaryCtaField } from '../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../components/bottom-cta/amount-cta-field/amount-cta-field';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';

export interface IExternalProps {
    extensionTxPayload: {
        method: NotificationType;
        params: any[];
    };
    callback: () => void;
}

export interface IReduxProps {
    walletName: string;
    account: IAccountState;
}

type IProps = IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>;

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps): IReduxProps => {
    const params = (ownProps?.extensionTxPayload?.params || [])[0];
    const wallet = params?.walletPubKey
        ? getWalletByPubKey(state, params.walletPubKey)
        : getSelectedWallet(state);

    return {
        walletName: wallet.name,
        account: wallet.accounts.find(
            acc => acc.address === params?.address && acc.blockchain === params?.blockchain
        )
    };
};

const renderField = (props: IProps, label: string, value: string) => {
    const { styles } = props;

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.receipientLabel}>{label}</Text>
            <View style={styles.inputBox}>
                <Text style={styles.confirmTransactionText}>{value}</Text>
            </View>
        </View>
    );
};

const renderTransferTransaction = (props: IProps) => {
    const account = props.account;
    const tx: IBlockchainTransaction = (props?.extensionTxPayload?.params || [])[0];
    const from = formatAddress(tx.address, tx.blockchain);
    const recipient = formatAddress(tx.toAddress, tx.blockchain);

    const tokenConfig = tx.token;

    const displayAmount = getBlockchain(tx.blockchain)
        .account.amountFromStd(new BigNumber(tx.amount), tokenConfig.decimals)
        .toFixed();

    if (!tx?.feeOptions?.feeTotal) {
        tx.feeOptions.feeTotal = new BigNumber(tx.feeOptions.gasPrice)
            .multipliedBy(tx.feeOptions.gasLimit)
            .toFixed();
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={props.styles.container}>
                {renderField(props, translate('TransactionRequest.walletName'), props.walletName)}
                {renderField(
                    props,
                    translate('TransactionRequest.accountName'),
                    account?.name || `Account ${account.index + 1}`
                )}
                {renderField(props, translate('App.labels.from'), from)}
                {renderField(props, translate('App.labels.recipient'), recipient)}
                {renderField(
                    props,
                    translate('App.labels.amount'),
                    `${displayAmount} ${tokenConfig.symbol}`
                )}
                <FeeTotal
                    amount={tx.feeOptions.feeTotal}
                    blockchain={tx.blockchain}
                    tokenSymbol={getBlockchain(tx.blockchain).config.coin}
                    options={{
                        backgroundColor: props.theme.colors.inputBackground
                    }}
                />
            </View>

            <BottomCta
                label={translate('App.labels.confirm')}
                disabled={props.extensionTxPayload === undefined}
                onPress={() => props.callback()}
            >
                <PrimaryCtaField
                    label={translate('App.labels.send')}
                    action={translate('App.labels.to')}
                    value={recipient}
                />
                <AmountCtaField
                    tokenConfig={tokenConfig}
                    stdAmount={new BigNumber(tx.amount)}
                    account={account}
                />
            </BottomCta>
        </View>
    );
};

const renderContractCallTransaction = (props: IProps, { showDetails, setShowDetails }) => {
    const account = props.account;
    const tx: IBlockchainTransaction = (props?.extensionTxPayload?.params || [])[0];
    const from = formatAddress(tx.address, tx.blockchain);
    const contract = formatAddress(tx.toAddress, tx.blockchain);
    const tokenConfig = getTokenConfig(tx.blockchain, getBlockchain(tx.blockchain).config.coin);

    const displayAmount = getBlockchain(tx.blockchain)
        .account.amountFromStd(new BigNumber(tx.amount), tokenConfig.decimals)
        .toFixed();

    if (!tx?.feeOptions?.feeTotal) {
        tx.feeOptions.feeTotal = new BigNumber(tx.feeOptions.gasPrice)
            .multipliedBy(tx.feeOptions.gasLimit)
            .toFixed();
    }

    return (
        <View style={{ flex: 1, paddingBottom: 100 }}>
            <ScrollView style={props.styles.container}>
                {renderField(props, translate('TransactionRequest.walletName'), props.walletName)}
                {renderField(
                    props,
                    translate('TransactionRequest.accountName'),
                    account?.name || `Account ${account.index + 1}`
                )}
                {renderField(props, translate('App.labels.from'), from)}
                {renderField(props, translate('App.labels.contract'), contract)}
                {renderField(
                    props,
                    translate('App.labels.amount'),
                    `${displayAmount} ${tokenConfig.symbol}`
                )}
                {renderField(props, translate('App.labels.function'), tx?.data?.method)}
                <FeeTotal
                    amount={tx.feeOptions.feeTotal}
                    blockchain={tx.blockchain}
                    tokenSymbol={getBlockchain(tx.blockchain).config.coin}
                    options={{
                        backgroundColor: props.theme.colors.inputBackground
                    }}
                />
                {renderTxDetails(tx, { showDetails, setShowDetails })}
            </ScrollView>

            <BottomCta
                label={translate('App.labels.confirm')}
                disabled={props.extensionTxPayload === undefined}
                onPress={() => props.callback()}
            ></BottomCta>
        </View>
    );
};

const renderTxDetails = (tx: IBlockchainTransaction, { showDetails, setShowDetails }) => {
    return (
        <>
            {!showDetails && (
                <Button onPress={() => setShowDetails(true)}>
                    {translate('App.labels.viewDetails')}
                </Button>
            )}
            {showDetails && (
                <Button onPress={() => setShowDetails(false)}>
                    {translate('App.labels.hideDetails')}
                </Button>
            )}
            {showDetails && (
                <View>
                    {tx.code && <Text large>{translate('App.labels.contractCode')}</Text>}
                    {tx.code && (
                        <Text darker style={{ fontVariant: ['tabular-nums'] }}>
                            {tx.code}
                        </Text>
                    )}
                    <Text large>
                        {tx.code
                            ? translate('App.labels.contractInit')
                            : translate('App.labels.contractCallParams')}
                    </Text>
                    <Text darker style={{ fontVariant: ['tabular-nums'] }}>
                        {JSON.stringify(tx.data.raw, null, 4)}
                    </Text>
                </View>
            )}
        </>
    );
};

const renderContractDeployTransaction = (props: IProps, { showDetails, setShowDetails }) => {
    const account = props.account;
    const tx: IBlockchainTransaction = (props?.extensionTxPayload?.params || [])[0];
    const from = formatAddress(tx.address, tx.blockchain);

    const tokenConfig = getTokenConfig(tx.blockchain, getBlockchain(tx.blockchain).config.coin);

    const displayAmount = getBlockchain(tx.blockchain)
        .account.amountFromStd(new BigNumber(tx.amount), tokenConfig.decimals)
        .toFixed();

    if (!tx?.feeOptions?.feeTotal) {
        tx.feeOptions.feeTotal = new BigNumber(tx.feeOptions.gasPrice)
            .multipliedBy(tx.feeOptions.gasLimit)
            .toFixed();
    }

    return (
        <View style={{ flex: 1, paddingBottom: 100 }}>
            <ScrollView style={props.styles.container}>
                {renderField(props, translate('TransactionRequest.walletName'), props.walletName)}
                {renderField(
                    props,
                    translate('TransactionRequest.accountName'),
                    account?.name || `Account ${account.index + 1}`
                )}
                {renderField(props, translate('App.labels.from'), from)}
                {renderField(
                    props,
                    translate('App.labels.amount'),
                    `${displayAmount} ${tokenConfig.symbol}`
                )}

                <FeeTotal
                    amount={tx.feeOptions.feeTotal}
                    blockchain={tx.blockchain}
                    tokenSymbol={getBlockchain(tx.blockchain).config.coin}
                    options={{
                        backgroundColor: props.theme.colors.inputBackground
                    }}
                />
                {renderTxDetails(tx, { showDetails, setShowDetails })}
            </ScrollView>

            <BottomCta
                label={translate('App.labels.confirm')}
                disabled={props.extensionTxPayload === undefined}
                onPress={() => props.callback()}
            ></BottomCta>
        </View>
    );
};

const renderSignMessage = (props: IProps) => {
    const account = props.account;
    const message = (props?.extensionTxPayload?.params || [])[0]?.message;
    const from = formatAddress(account.address, account.blockchain);

    return (
        <View style={{ flex: 1, paddingBottom: 100 }}>
            <ScrollView style={props.styles.container}>
                {renderField(props, translate('TransactionRequest.walletName'), props.walletName)}
                {renderField(
                    props,
                    translate('TransactionRequest.accountName'),
                    account?.name || `Account ${account.index + 1}`
                )}
                {renderField(props, translate('App.labels.from'), from)}

                <Text large>{translate('App.labels.message')}</Text>
                <Text darker style={{ fontVariant: ['tabular-nums'] }}>
                    {message}
                </Text>
            </ScrollView>

            <BottomCta
                label={translate('App.labels.confirm')}
                disabled={props.extensionTxPayload === undefined}
                onPress={() => props.callback()}
            ></BottomCta>
        </View>
    );
};

export const ExtensionTransferRequestComponent = (props: IProps) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);

    switch (props.extensionTxPayload?.method) {
        case NotificationType.MOONLET_SIGN_MESSAGE:
            return renderSignMessage(props);
        case NotificationType.MOONLET_TRANSACTION:
            const tx: IBlockchainTransaction = (props.extensionTxPayload?.params || [])[0];
            switch (tx?.type) {
                case TransactionType.TRANSFER:
                    return renderTransferTransaction(props);
                case TransactionType.CONTRACT_CALL:
                    return renderContractCallTransaction(props, { showDetails, setShowDetails });
                case TransactionType.CONTRACT_DEPLOY:
                    return renderContractDeployTransaction(props, { showDetails, setShowDetails });
                default:
                // TODO: unsupported transaction
            }
            break;
        default:
        // TODO: unsupported request
    }

    return null;
};

export const ExtensionTransferRequest = smartConnect<IExternalProps>(
    ExtensionTransferRequestComponent,
    [connect(mapStateToProps), withTheme(stylesProvider)]
);
