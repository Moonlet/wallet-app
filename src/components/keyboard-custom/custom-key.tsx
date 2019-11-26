import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

export interface IProps {
    currentWord: any;
    addKey: (key: string) => void;
}

export class CustomKeyComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    public onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            this.props.addKey(this.props.currentWord);
        }
    };

    public render() {
        const styles = this.props.styles;

        return (
            <PanGestureHandler {...this.props} onHandlerStateChange={this.onHandlerStateChange}>
                <View style={styles.keyContainer}>
                    <Text style={styles.keyText}>{this.props.currentWord}</Text>
                </View>
            </PanGestureHandler>
        );
    }
}

export const CustomKey = smartConnect<IProps>(CustomKeyComponent, [withTheme(stylesProvider)]);
