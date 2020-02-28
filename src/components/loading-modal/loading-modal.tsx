import React from 'react';
import { View, ActivityIndicator, Modal, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';

interface IExternalProps {
    spinnerColor?: string;
}

export interface IReduxProps {
    isVisible: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        isVisible: state.ui.loadingModal.isVisible
    };
};

export const LoadingModalComponent = (
    props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    if (Platform.OS === 'web') {
        if (props.isVisible) {
            return (
                <View style={props.styles.webContainer}>
                    <ActivityIndicator
                        size="large"
                        color={props.spinnerColor ? props.spinnerColor : props.theme.colors.accent}
                    />
                </View>
            );
        } else {
            return <View />;
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.isVisible}
            presentationStyle="overFullScreen"
        >
            <View style={props.styles.container}>
                <ActivityIndicator
                    size="large"
                    color={props.spinnerColor ? props.spinnerColor : props.theme.colors.accent}
                />
            </View>
        </Modal>
    );
};

export const LoadingModal = smartConnect<IExternalProps>(LoadingModalComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
