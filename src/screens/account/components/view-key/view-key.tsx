import React from 'react';
import { View, TouchableOpacity, Clipboard } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Icon } from '../../../../components/icon';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { ICON_SIZE } from '../../../../styles/dimensions';
import {
    withNavigationParams,
    INavigationProps
} from '../../../../navigation/with-navigation-params';

export interface IExternalProps {
    value: string;
}

interface IState {
    copied: boolean;
}

export class ViewKeyComponent extends React.Component<
    IExternalProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IExternalProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            copied: false
        };
    }

    public render() {
        const styles = this.props.styles;
        return (
            <View style={styles.contentContainer}>
                <View style={styles.keyWrapper}>
                    <Text
                        style={[
                            styles.keyText,
                            { marginBottom: this.props.value.length >= 50 ? 16 : 90 }
                        ]}
                    >
                        {this.props.value}
                    </Text>
                </View>

                <View style={styles.tipWrapper}>
                    <Icon name="warning" size={ICON_SIZE / 2} style={styles.alertIcon} />
                    <Text style={styles.tipText}>{translate('AccountSettings.securityTip')}</Text>
                    <Text style={styles.tipText}>{translate('AccountSettings.securityTip2')}</Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                    testID="copy-clipboard"
                    style={styles.rowContainer}
                    onPress={() => {
                        Clipboard.setString(this.props.value);
                        this.setState({ copied: true });
                    }}
                >
                    <View style={styles.leftIcon}>
                        <Icon name="copy" size={ICON_SIZE} style={styles.icon} />
                    </View>
                    <Text style={styles.textRow}>
                        {this.state.copied === false
                            ? translate('App.buttons.clipboardBtn')
                            : translate('App.buttons.copiedBtn')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export const ViewKey = smartConnect<IExternalProps>(ViewKeyComponent, [
    withTheme(stylesProvider),
    withNavigationParams()
]);
