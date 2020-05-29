import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { translate } from '../../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { formatAddress } from '../../../core/utils/format-address';
import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { FeeTotal } from '../../send/components/fee-total/fee-total';
import { BottomCta } from '../../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../components/bottom-cta/amount-cta-field/amount-cta-field';
import { Text } from '../../../library';
import { getSelectedWallet } from '../../../redux/wallets/selectors';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';

export interface IExternalProps {
    extensionTxPayload: any;
    callback: () => void;
}

export interface IReduxProps {
    walletName: string;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        walletName: getSelectedWallet(state).name
    };
};

export const ExtensionTransferRequestComponent = (
    props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const renderField = (label: string, value: string) => {
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

    const { account, amount, token, feeOptions, toAddress } = props.extensionTxPayload;
    const { blockchain } = account;

    const from = formatAddress(account.address, blockchain);
    const recipient = formatAddress(toAddress, blockchain);

    const tokenConfig = getTokenConfig(blockchain, token);

    const stdAmount = getBlockchain(blockchain).account.amountToStd(
        new BigNumber(amount),
        tokenConfig.decimals
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={props.styles.container}>
                {renderField(translate('TransactionRequest.walletName'), props.walletName)}
                {renderField(
                    translate('TransactionRequest.accountName'),
                    account?.name || `Account ${account.index + 1}`
                )}
                {renderField(translate('App.labels.from'), from)}
                {renderField(translate('App.labels.recipient'), recipient)}
                {renderField(translate('App.labels.amount'), `${amount} ${token}`)}
                <FeeTotal
                    amount={feeOptions.feeTotal}
                    blockchain={blockchain}
                    tokenSymbol={getBlockchain(blockchain).config.coin}
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
                <AmountCtaField tokenConfig={tokenConfig} stdAmount={stdAmount} account={account} />
            </BottomCta>
        </View>
    );
};

export const ExtensionTransferRequest = smartConnect<IExternalProps>(
    ExtensionTransferRequestComponent,
    [connect(mapStateToProps), withTheme(stylesProvider)]
);
