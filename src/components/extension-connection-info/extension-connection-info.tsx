import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { translate } from '../../core/i18n';

export interface IReduxProps {
    stateLoaded: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        stateLoaded: state.ui.extension.stateLoaded // TODO: check this
    };
};

export const ExtensionConnectionInfoComponent = ({
    stateLoaded,
    styles
}: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) =>
    stateLoaded ? null : (
        <View style={styles.container}>
            <Text style={styles.text}>{translate('App.labels.extensionNotConnected')}</Text>
        </View>
    );

export const ExtensionConnectionInfo = smartConnect(ExtensionConnectionInfoComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
