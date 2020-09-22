import React from 'react';
import { View, Image } from 'react-native';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Button, Text } from '../../../../library';
import { ListCard } from '../../../../components/list-card/list-card';
import { IconValues } from '../../../../components/icon/values';
import { translate } from '../../../../core/i18n';
import { Blockchain } from '../../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../../core/wallet/hw-wallet/types';

interface IExternalProps {
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    deviceName: string;
    walletName: string;
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
                <Image
                    source={require('../../../../assets/icons/staking/staking_image_1.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <View style={{ flex: 1 }}>
                    <Text style={styles.primaryText}>{'Pairing successful'}</Text>

                    <Text style={styles.secondaryText}>
                        {'You Ledger Nano S is ready\nto be used with Moonlet.'}
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

                    <Button
                        primary
                        onPress={() => {
                            //
                        }}
                    >
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
