import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import Icon from '../../icon';
import { ICON_SIZE, BASE_DIMENSION } from '../../../styles/dimensions';
import { LoadingIndicator } from '../../loading-indicator/loading-indicator';
import WebView from '../../../library/webview/webview';

interface IExternalProps {
    onClose?: () => void;
    showClose?: boolean;
}

export const TCComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View
            style={[
                props.styles.container,
                { paddingTop: Platform.OS === 'ios' && props.showClose ? BASE_DIMENSION * 5 : 0 }
            ]}
        >
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
                        source={{ uri: 'https://moonlet.xyz/terms-and-conditions/' }}
                        renderLoading={() => (
                            <View style={props.styles.loadingIndicator}>
                                <LoadingIndicator />
                            </View>
                        )}
                    />
                </View>
            </React.Fragment>
        </View>
    );
};

export const TC = smartConnect<IExternalProps>(TCComponent, [withTheme(stylesProvider)]);
