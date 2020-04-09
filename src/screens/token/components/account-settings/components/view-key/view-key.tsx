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

export enum KeyType {
    private = 'private',
    public = 'public'
}

export interface IExternalProps {
    value: string;
    showSecurityWarning: boolean;
    keyType: KeyType;
}

interface IState {
    copied: boolean;
    unveilMnemonic: boolean;
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
            copied: false,
            unveilMnemonic: false
        };

        forbidScreenshots();
    }

    public componentWillUnmount() {
        allowScreenshots();
    }

    public render() {
        const { styles } = this.props;
        const showCopyButton =
            this.props.keyType === KeyType.public ||
            (this.props.keyType === KeyType.private && isFeatureActive(RemoteFeature.DEV_TOOLS));

        return (
            <View style={styles.contentContainer}>
                <View style={styles.keyWrapper}>
                    <Text style={styles.keyText}>
                        {this.props.keyType === KeyType.public || this.state.unveilMnemonic
                            ? this.props.value
                            : '******************************************************************************************'}
                    </Text>
                </View>

                {this.props.showSecurityWarning && (
                    <View style={styles.tipWrapper}>
                        <Icon name="warning" size={ICON_SIZE} style={styles.alertIcon} />
                        <Text style={styles.tipText}>
                            {translate('AccountSettings.securityTip')}
                        </Text>
                    </View>
                )}

                <View style={styles.divider} />

                {this.props.keyType === KeyType.private && (
                    <TouchableOpacity
                        testID="unveil-mnemonic"
                        style={styles.holdUnveilContainer}
                        onPressIn={() => this.setState({ unveilMnemonic: true })}
                        onPressOut={() => this.setState({ unveilMnemonic: false })}
                    >
                        <Icon name="view-1" size={ICON_SIZE} style={styles.icon} />
                        <Text style={styles.textRow}>{translate('App.labels.holdUnveil')}</Text>
                    </TouchableOpacity>
                )}

                {showCopyButton && (
                    <TouchableOpacity
                        testID="copy-clipboard"
                        style={styles.copyClipboardContainer}
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
                )}
            </View>
        );
    }
}

export const ViewKey = smartConnect<IExternalProps>(ViewKeyComponent, [
    withTheme(stylesProvider),
    withNavigationParams()
]);
