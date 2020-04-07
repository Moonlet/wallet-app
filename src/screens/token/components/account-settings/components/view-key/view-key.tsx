import React from 'react';
import { View, TouchableOpacity, Clipboard } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../../../core/theme/with-theme';
import { Icon } from '../../../../../../components/icon';
import { smartConnect } from '../../../../../../core/utils/smart-connect';
import { Text } from '../../../../../../library';
import { translate } from '../../../../../../core/i18n';
import { ICON_SIZE } from '../../../../../../styles/dimensions';
import {
    withNavigationParams,
    INavigationProps
} from '../../../../../../navigation/with-navigation-params';
import { allowScreenshots, forbidScreenshots } from '../../../../../../core/utils/screenshot';
import { isFeatureActive, RemoteFeature } from '../../../../../../core/utils/remote-feature-config';

export interface IExternalProps {
    value: string;
    showSecurityWarning: boolean;
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

        forbidScreenshots();
    }

    public componentWillUnmount() {
        allowScreenshots();
    }

    public render() {
        const styles = this.props.styles;
        return (
            <View style={styles.contentContainer}>
                <View style={styles.keyWrapper}>
                    <Text style={styles.keyText}>{this.props.value}</Text>
                </View>

                {this.props.showSecurityWarning && (
                    <View style={styles.tipWrapper}>
                        <Icon name="warning" size={ICON_SIZE} style={styles.alertIcon} />
                        <Text style={styles.tipText}>
                            {translate('AccountSettings.securityTip')}
                        </Text>
                    </View>
                )}

                {isFeatureActive(RemoteFeature.DEV_TOOLS) && (
                    <View>
                        <View style={styles.divider} />

                        <TouchableOpacity
                            testID="copy-clipboard"
                            style={styles.rowContainer}
                            onPress={() => {
                                Clipboard.setString(this.props.value);
                                this.setState({ copied: true });
                            }}
                        >
                            <Icon name="copy" size={ICON_SIZE} style={styles.icon} />
                            <Text style={styles.textRow}>
                                {this.state.copied === false
                                    ? translate('App.buttons.clipboardBtn')
                                    : translate('App.buttons.copiedBtn')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
}

export const ViewKey = smartConnect<IExternalProps>(ViewKeyComponent, [
    withTheme(stylesProvider),
    withNavigationParams()
]);
