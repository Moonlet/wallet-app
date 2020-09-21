import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text, Button } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { Blockchain } from '../../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../../core/wallet/hw-wallet/types';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    isVerification: boolean;
}

export class FailedComponentComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const { styles, isVerification } = this.props;

        return (
            <View style={styles.container}>
                <Image
                    source={require('../../../../assets/icons/staking/staking_image_1.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.primaryText}>
                    {isVerification
                        ? translate('LedgerConnect.verificationFailed')
                        : translate('LedgerConnect.somethingWentWrong')}
                </Text>

                <Text style={styles.secondaryText}>
                    {isVerification
                        ? translate('LedgerConnect.confirmFailed', {
                              blockchain: this.props.blockchain,
                              deviceModel: translate(`LedgerConnect.${this.props.deviceModel}`)
                          })
                        : translate('LedgerConnect.tryAgain')}
                </Text>

                {!isVerification && (
                    <TouchableOpacity
                        onPress={() => {
                            //
                        }}
                    >
                        <Text style={[styles.secondaryText, styles.troubleshooText]}>
                            {translate('LedgerConnect.troubleshooting')}
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={{ flex: 1 }} />

                <Button
                    primary
                    onPress={() => {
                        //
                    }}
                >
                    {translate('App.labels.retry')}
                </Button>
            </View>
        );
    }
}

export const FailedComponent = smartConnect<IExternalProps>(FailedComponentComponent, [
    withTheme(stylesProvider)
]);
