import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text, Button } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { Blockchain } from '../../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../../core/wallet/hw-wallet/types';
import Img from '../../../../assets/icons/ledger/verification-failed.svg';
import { normalize } from '../../../../styles/dimensions';
import { svgDimmensions } from '../../ledger-connect-component';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    onRetry: () => void;
}

export class VerificationFailedComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <Img
                    width={normalize(svgDimmensions.width)}
                    height={normalize(svgDimmensions.height)}
                />
                <Text style={styles.primaryText}>
                    {translate('LedgerConnect.verificationFailed')}
                </Text>
                <Text style={styles.secondaryText}>
                    {translate('LedgerConnect.confirmFailed', {
                        blockchain: this.props.blockchain,
                        deviceModel: translate(`LedgerConnect.${this.props.deviceModel}`)
                    })}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        //
                    }}
                >
                    <Text style={[styles.secondaryText, styles.troubleshooText]}>
                        {translate('LedgerConnect.troubleshooting')}
                    </Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />
                <Button primary onPress={() => this.props.onRetry()}>
                    {translate('App.labels.retry')}
                </Button>
            </View>
        );
    }
}

export const VerificationFailed = smartConnect<IExternalProps>(VerificationFailedComponent, [
    withTheme(stylesProvider)
]);
