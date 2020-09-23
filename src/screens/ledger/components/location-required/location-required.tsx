import React from 'react';
import { View } from 'react-native';
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
import AndroidOpenSettings from '../../../../library/open-settings/open-settings';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    onPress: () => void;
}

export class LocationRequiredComponent extends React.Component<
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
                    {translate('LedgerConnect.locationRequired')}
                </Text>
                <Text style={styles.secondaryText}>
                    {translate('LedgerConnect.locationRequiredSubtitle')}
                </Text>

                <View style={{ flex: 1 }} />
                <Button
                    primary
                    onPress={() => {
                        AndroidOpenSettings.locationSourceSettings();
                        this.props.onPress();
                    }}
                >
                    {translate('LedgerConnect.openSettings')}
                </Button>
            </View>
        );
    }
}

export const LocationRequired = smartConnect<IExternalProps>(LocationRequiredComponent, [
    withTheme(stylesProvider)
]);
