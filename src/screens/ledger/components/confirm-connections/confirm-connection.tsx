import React from 'react';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { Blockchain } from '../../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../../core/wallet/hw-wallet/types';
import { normalize } from '../../../../styles/dimensions';
import { svgDimmensions } from '../../ledger-connect-component';
import Img from '../../../../assets/icons/ledger/bluetooth-pairing.svg';
import { View } from 'react-native';
import { translate } from '../../../../core/i18n';
import { SmartImage } from '../../../../library/image/smart-image';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
}

export class ConfirmConnectionComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <SmartImage
                    source={{ iconComponent: Img }}
                    style={{
                        width: normalize(svgDimmensions.width),
                        height: normalize(svgDimmensions.height)
                    }}
                />

                <View style={{ flex: 1 }}>
                    <Text style={styles.primaryText}>
                        {translate('LedgerConnect.confirmConnection')}
                    </Text>

                    <Text style={styles.secondaryText}>
                        {translate('LedgerConnect.confirmBothDevices', {
                            deviceModel: translate(`LedgerConnect.${this.props.deviceModel}`)
                        })}
                    </Text>

                    <View style={{ flex: 1 }}>
                        <LoadingIndicator />
                    </View>
                </View>
            </View>
        );
    }
}

export const ConfirmConnection = smartConnect<IExternalProps>(ConfirmConnectionComponent, [
    withTheme(stylesProvider)
]);
