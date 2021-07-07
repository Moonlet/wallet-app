import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import WebView from 'react-native-webview';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import CONFIG from '../../../../config';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import SafeAreaView, { SafeAreaProvider } from 'react-native-safe-area-view';

export const TroubleshootingComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView forceInset={{ bottom: 'never' }} style={props.styles.container}>
                <React.Fragment>
                    <View style={props.styles.webviewContainer}>
                        <WebView
                            startInLoadingState={true}
                            source={{ uri: CONFIG.troubleshootingUrl }}
                            renderLoading={() => (
                                <View style={props.styles.loadingIndicator}>
                                    <LoadingIndicator />
                                </View>
                            )}
                        />
                    </View>
                </React.Fragment>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export const Troubleshooting = smartConnect(TroubleshootingComponent, [withTheme(stylesProvider)]);
