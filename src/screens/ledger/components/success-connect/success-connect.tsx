import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Button, Text } from '../../../../library';
import { ListCard } from '../../../../components/list-card/list-card';
import { IconValues } from '../../../../components/icon/values';
import { translate } from '../../../../core/i18n';
import { Blockchain } from '../../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../../core/wallet/hw-wallet/types';
import Img from '../../../../assets/icons/ledger/success-connect.svg';
import { normalize } from '../../../../styles/dimensions';
import { svgDimmensions } from '../../ledger-connect-component';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    deviceName: string;
    walletName: string;
    onContinue: () => void;
}

export class SuccessConnectComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const { styles, theme } = this.props;

        const cardLabel = (
            <View>
                <Text style={[styles.cardText, { color: theme.colors.text }]}>
                    {this.props.deviceName}
                </Text>
                <Text style={styles.cardSecondaryText}>{this.props.walletName}</Text>
            </View>
        );

        return (
            <View style={styles.container}>
                <Img
                    width={normalize(svgDimmensions.width)}
                    height={normalize(svgDimmensions.height)}
                />

                <View style={{ flex: 1 }}>
                    <Text style={styles.primaryText}>
                        {translate('LedgerConnect.pairingSuccess')}
                    </Text>

                    <Text style={styles.secondaryText}>
                        {translate('LedgerConnect.readyToUse', {
                            deviceModel: translate(`LedgerConnect.${this.props.deviceModel}`)
                        })}
                    </Text>

                    <View style={{ flex: 1 }}>
                        <ListCard
                            key={`key`}
                            label={cardLabel}
                            leftIcon={IconValues.LEDGER_LOOGO}
                            // TODO: this should be String `Rename`
                            // rightIcon={IconValues.CHECK}
                            selected={true}
                            onPress={() => {
                                //
                            }}
                        />
                    </View>

                    <Button primary onPress={() => this.props.onContinue()}>
                        {translate('App.labels.continue')}
                    </Button>
                </View>
            </View>
        );
    }
}

export const SuccessConnect = smartConnect<IExternalProps>(SuccessConnectComponent, [
    withTheme(stylesProvider)
]);
