import React from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import bind from 'bind-decorator';

export interface IExternalProps {
    currentWord: any;
    addKey: (key: string) => void;
    testID?: string;
}

export class CustomKeyComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    @bind
    private onHandlerStateChange(event: any) {
        if (event.nativeEvent.state === State.END) {
            this.addKey();
        }
    }

    @bind
    private addKey() {
        this.props.addKey(this.props.currentWord);
    }

    public render() {
        const { styles } = this.props;

        if (Platform.OS === 'android') {
            return (
                <PanGestureHandler
                    testID={this.props?.testID}
                    {...this.props}
                    onHandlerStateChange={this.onHandlerStateChange}
                >
                    <View style={styles.keyContainer}>
                        <Text style={styles.keyText}>{this.props.currentWord}</Text>
                    </View>
                </PanGestureHandler>
            );
        } else {
            return (
                <TouchableOpacity
                    testID={`key-${this.props?.testID}`}
                    onPressIn={this.addKey}
                    style={styles.keyContainer}
                >
                    <Text style={styles.keyText}>{this.props.currentWord}</Text>
                </TouchableOpacity>
            );
        }
    }
}

export const CustomKey = smartConnect<IExternalProps>(CustomKeyComponent, [
    withTheme(stylesProvider)
]);
