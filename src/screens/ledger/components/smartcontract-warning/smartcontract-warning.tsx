import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text, Button } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { Blockchain } from '../../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../../core/wallet/hw-wallet/types';
import Img from '../../../../assets/icons/ledger/error.svg';
import { normalize } from '../../../../styles/dimensions';
import { svgDimmensions } from '../../ledger-connect-component';
import { SmartImage } from '../../../../library/image/smart-image';
import { Capitalize } from '../../../../core/utils/format-string';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    onRetry: () => void;
    onTroubleshootPress: () => void;
}

export class SmartContractWarningComponent extends React.Component<
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

                <Text style={styles.primaryText}>
                    {translate('LedgerConnect.enableContractData', {
                        blockchain: Capitalize(this.props.blockchain)
                    })}
                </Text>

                <TouchableOpacity onPress={() => this.props.onTroubleshootPress()}>
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

export const SmartContractWarning = smartConnect<IExternalProps>(SmartContractWarningComponent, [
    withTheme(stylesProvider)
]);
