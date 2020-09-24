import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import WebView from 'react-native-webview';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import CONFIG from '../../../../config';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { SafeAreaView } from 'react-navigation';

export const TroubleshootingComponent = (props: IThemeProps<ReturnType<typeof stylesProvider>>) => {
    return (
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
    );
};

export const Troubleshooting = smartConnect(TroubleshootingComponent, [withTheme(stylesProvider)]);
