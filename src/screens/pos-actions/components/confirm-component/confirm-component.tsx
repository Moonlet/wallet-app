import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { translate } from '../../../../core/i18n';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { Text } from '../../../../library';
import { ChainIdType, IFeeOptions } from '../../../../core/blockchain/types';
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
import { getInputAmountToStd } from '../../../../core/utils/available-funds';
import { BASE_DIMENSION } from '../../../../styles/dimensions';
import { Amount } from '../../../../components/amount/amount';
import { formatAddress } from '../../../../core/utils/format-address';
import { valuePrimaryCtaField } from '../../../../core/utils/format-string';
import { formatNumber } from '../../../../core/utils/format-number';
import { BigNumber } from 'bignumber.js';

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
    amount: string;
    showSteps: boolean;
    feeOptions: IFeeOptions;
    onPressConfirm(): void;
}

interface IState {
    headerSteps: IHeaderStep[];
}

export class ConfirmComponentComponent extends React.Component<
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
                    active: index === 2 ? true : false
                });
            });
        }

        this.state = {
            headerSteps: stepList
        };
    }

    private renderBottomConfirm() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        return (
            <BottomCta
                label={translate('App.labels.confirm')}
                disabled={false}
                onPress={() => {
                    this.props.onPressConfirm();
                }}
            >
                <PrimaryCtaField
                    label={translate(this.props.actionText)}
                    action={translate('App.labels.for').toLowerCase()}
                    value={valuePrimaryCtaField(this.props.validators)}
                />
                <AmountCtaField
                    tokenConfig={tokenConfig}
                    stdAmount={getInputAmountToStd(
                        this.props.account,
                        this.props.token,
                        this.props.amount
                    )}
                    account={this.props.account}
                />
            </BottomCta>
        );
    }

    private renderConfirmTransaction() {
        const { account, chainId, styles } = this.props;
        const { blockchain } = account;
        const config = getBlockchain(blockchain).config;

        const feeToken = getTokenConfig(
            account.blockchain,
            account.tokens[chainId][config.coin].symbol
        );
        const feeTokenSymbol = config.feeOptions.gasPriceToken;

        let receipientText = '';

        this.props.validators.map((validator, index) => {
            receipientText +=
                ' ' + validator.name + (index !== this.props.validators.length - 1 ? ',' : '');
        });

        const formatAmount = formatNumber(new BigNumber(this.props.amount), {
            currency: getBlockchain(blockchain).config.coin
        });

        return (
            <View key="confirmTransaction" style={styles.confirmTransactionContainer}>
                <Text style={styles.receipientLabel}>{translate('App.labels.from')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Text style={styles.confirmTransactionText}>
                        {formatAddress(this.props.account.address, this.props.account.blockchain)}
                    </Text>
                </View>
                <Text style={styles.receipientLabel}>{translate('Send.recipientLabel')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Text style={styles.confirmTransactionText}>{receipientText}</Text>
                </View>

                <Text style={styles.receipientLabel}>{translate('Send.amount')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Text style={styles.confirmTransactionText}>{formatAmount}</Text>
                </View>

                <Text style={styles.receipientLabel}>{translate('App.labels.fees')}</Text>
                <View style={[styles.inputBox, { marginBottom: BASE_DIMENSION * 2 }]}>
                    <Amount
                        style={styles.confirmTransactionText}
                        token={feeTokenSymbol}
                        tokenDecimals={feeToken.decimals}
                        amount={this.props.feeOptions?.feeTotal}
                        blockchain={blockchain}
                    />
                </View>
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
                        {this.renderConfirmTransaction()}
                    </View>
                </KeyboardAwareScrollView>

                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const ConfirmComponent = smartConnect<IProps>(ConfirmComponentComponent, [
    withTheme(stylesProvider)
]);
