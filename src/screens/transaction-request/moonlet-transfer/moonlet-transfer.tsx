import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { translate } from '../../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { formatAddress } from '../../../core/utils/format-address';
import { formatNumber } from '../../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { FeeTotal } from '../../send/components/fee-total/fee-total';
import { BottomCta } from '../../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../components/bottom-cta/amount-cta-field/amount-cta-field';
import { Text } from '../../../library';

export interface IExternalProps {
    moonletTransferPayload: any;
    callback: () => void;
}

export const MoonletTransferTxRequestComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
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

    const { moonletTransferPayload } = props;

    const account = moonletTransferPayload.account;
    const blockchain = account.blockchain;

    const from = formatAddress(account.address, blockchain);
    const recipient = formatAddress(moonletTransferPayload.toAddress, blockchain);

    const formattedAmount = formatNumber(new BigNumber(moonletTransferPayload.amount), {
        currency: getBlockchain(blockchain).config.coin
    });

    const tokenConfig = getTokenConfig(blockchain, moonletTransferPayload.token);

    const stdAmount = getBlockchain(blockchain).account.amountToStd(
        new BigNumber(moonletTransferPayload.amount),
        tokenConfig.decimals
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={props.styles.container}>
                {renderField(
                    translate('TransactionRequest.walletName'),
                    moonletTransferPayload.walletName
                )}
                {renderField(
                    translate('TransactionRequest.accountName'),
                    account?.name || `Account ${account.index + 1}`
                )}
                {renderField(translate('App.labels.from'), from)}
                {renderField(translate('App.labels.recipient'), recipient)}
                {renderField(translate('App.labels.amount'), formattedAmount)}
                <FeeTotal
                    amount={moonletTransferPayload.feeOptions.feeTotal}
                    blockchain={blockchain}
                    tokenSymbol={moonletTransferPayload.token}
                    options={{
                        backgroundColor: props.theme.colors.inputBackground
                    }}
                />
            </View>

            <BottomCta
                label={translate('App.labels.confirm')}
                disabled={moonletTransferPayload === undefined}
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

export const MoonletTransferTxRequest = smartConnect<IExternalProps>(
    MoonletTransferTxRequestComponent,
    [withTheme(stylesProvider)]
);
