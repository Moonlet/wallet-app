import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import Icon from '../../icon';
import { ICON_SIZE } from '../../../styles/dimensions';
import { LoadingIndicator } from '../../loading-indicator/loading-indicator';
import { WebView } from '../../../library/webview/webview';
import { SafeAreaView } from 'react-navigation';
import { CONFIG } from '../../../config';

interface IExternalProps {
    onClose?: () => void;
    showClose?: boolean;
}

export const PrivacyPolicyComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <SafeAreaView forceInset={{ bottom: 'never' }} style={props.styles.container}>
            <React.Fragment>
                {props.showClose && (
                    <TouchableOpacity
                        onPress={() => props.onClose && props.onClose()}
                        style={props.styles.button}
                    >
                        <View style={props.styles.iconContainer}>
                            <Icon name="close" size={ICON_SIZE} style={props.styles.icon} />
                        </View>
                    </TouchableOpacity>
                )}
                <View style={props.styles.webviewContainer}>
                    <WebView
                        startInLoadingState={true}
                        source={{ uri: CONFIG.privacyPolicyUrl }}
                        renderLoading={() => (
                            <View style={props.styles.loadingIndicator}>
                                <LoadingIndicator />
                            </View>
                        )}
                    />
                </View>
            </React.Fragment>
        </SafeAreaView>
    );
};

export const PrivacyPolicy = smartConnect<IExternalProps>(PrivacyPolicyComponent, [
    withTheme(stylesProvider)
]);
