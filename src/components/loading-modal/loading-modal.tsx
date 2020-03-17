import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { Text } from '../../library/text/text';
import { ILoadingModalMessage } from '../../redux/ui/loading-modal/state';
import { translate } from '../../core/i18n';
import { getSelectedBlockchain } from '../../redux/wallets/selectors';
import { Blockchain } from '../../core/blockchain/types';

interface IExternalProps {
    spinnerColor?: string;
}

export interface IReduxProps {
    isVisible: boolean;
    message: ILoadingModalMessage;
    blockchain: Blockchain;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.loadingModal.isVisible,
        message: state.ui.loadingModal.message,
        blockchain: getSelectedBlockchain(state)
    };
};

export const LoadingModalComponent = (
    props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const message =
        props.message && translate('LoadingModal.' + props.message.text, { app: props.blockchain });

    return (
        <View style={[props.styles.container, { display: props.isVisible ? 'flex' : 'none' }]}>
            <ActivityIndicator
                size="large"
                color={props.spinnerColor ? props.spinnerColor : props.theme.colors.accent}
            />
            {message && <Text style={props.styles.message}>{message}</Text>}
        </View>
    );
};

export const LoadingModal = smartConnect<IExternalProps>(LoadingModalComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
