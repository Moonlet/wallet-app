import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text, Button } from '../../../../library';
import { translate } from '../../../../core/i18n';
import Img from '../../../../assets/icons/ledger/verification-failed.svg';
import { normalize } from '../../../../styles/dimensions';
import { svgDimmensions } from '../../ledger-connect-component';
import { SmartImage } from '../../../../library/image/smart-image';

interface IExternalProps {
    onRetry: () => void;
    onCancel: () => void;
}

export class SignDeclinedComponent extends React.Component<
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
                    {translate('LedgerConnect.transactionDeclined')}
                </Text>

                <Text style={styles.secondaryText}>
                    {translate('LedgerConnect.transactionDeclinedDetails')}
                </Text>
                <View style={{ flex: 1 }} />

                <Button secondary style={styles.cancelButton} onPress={() => this.props.onCancel()}>
                    {translate('App.labels.cancel')}
                </Button>

                <Button primary onPress={() => this.props.onRetry()}>
                    {translate('App.labels.retry')}
                </Button>
            </View>
        );
    }
}

export const SignDeclined = smartConnect<IExternalProps>(SignDeclinedComponent, [
    withTheme(stylesProvider)
]);
