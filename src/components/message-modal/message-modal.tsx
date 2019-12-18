import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Text } from '../../library';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

export interface IExternalProps {
    visible: boolean;
    message: string;
}

export class MessageModalComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.visible}
                presentationStyle={'overFullScreen'}
            >
                <View style={styles.backgroundContainer}>
                    <View style={styles.container}>
                        <Text style={styles.textIndicator}>{this.props.message}</Text>
                        <ActivityIndicator size="large" color={theme.colors.accent} />
                    </View>
                </View>
            </Modal>
        );
    }
}

export const MessageModal = smartConnect<IExternalProps>(MessageModalComponent, [
    withTheme(stylesProvider)
]);
