import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { WebView } from 'react-native-webview';
import Icon from '../../icon';
import { ICON_SIZE } from '../../../styles/dimensions';
import { LoadingIndicator } from '../../loading-indicator/loading-indicator';

interface IExternalProps {
    onClose: () => void;
}

export const TCComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View style={props.styles.container}>
            <React.Fragment>
                <TouchableOpacity onPress={() => props.onClose()} style={props.styles.button}>
                    <View style={props.styles.iconContainer}>
                        <Icon name="close" size={ICON_SIZE} style={props.styles.icon} />
                    </View>
                </TouchableOpacity>
                <View style={props.styles.loadingContainer}>
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
