import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { normalize } from '../../../../styles/dimensions';
import { svgDimmensions } from '../../ledger-connect';
import Img from '../../../../assets/icons/staking/staking_image_1.svg';
import { Blockchain } from '../../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../../core/wallet/hw-wallet/types';
import { translate } from '../../../../core/i18n';
import { Capitalize } from '../../../../core/utils/format-string';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
}

export class OpenAppComponent extends React.Component<
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

                <View style={{ flex: 1 }}>
                    <Text style={styles.primaryText}>
                        {translate('LedgerConnect.openApp', {
                            blockchain: Capitalize(this.props.blockchain)
                        })}
                    </Text>

                    <Text style={styles.secondaryText}>
                        {translate('LedgerConnect.openAppOnDevice', {
                            blockchain: Capitalize(this.props.blockchain),
                            deviceModel: translate(`LedgerConnect.${this.props.deviceModel}`)
                        })}
                    </Text>
                </View>
            </View>
        );
    }
}

export const OpenApp = smartConnect<IExternalProps>(OpenAppComponent, [withTheme(stylesProvider)]);
