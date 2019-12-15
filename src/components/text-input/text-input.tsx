import React from 'react';
import { Text, View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';

export interface IExternalProps {
    word: string;
    style?: any;
    onFocus?: any;
    onBlur?: any;
    obRef?: any;
}

interface IState {
    cursorWidth: number;
}

export class TextInputComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static renderedTextInputComponents = new Set();

    public static focus(ref: any) {
        if (TextInputComponent.renderedTextInputComponents.has(ref)) {
            TextInputComponent.renderedTextInputComponents.forEach((r: any) =>
                r === ref ? r.focus() : r.blur()
            );
        }
    }
    public cursorInterval = null;

    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            cursorWidth: 0
        };

        props.obRef && props.obRef(this);
        this.cursorInterval = null;
        TextInputComponent.renderedTextInputComponents.add(this);
    }

    public componentWillUnmount() {
        TextInputComponent.renderedTextInputComponents.delete(this);
    }

    public focus() {
        if (!this.cursorInterval) {
            this.cursorInterval = setInterval(
                () => this.setState({ cursorWidth: (this.state.cursorWidth + 2) % 4 }),
                500
            );
        }
    }

    public blur() {
        clearInterval(this.cursorInterval);
        this.setState({ cursorWidth: 0 });
        this.cursorInterval = null;
        this.props.onBlur();
    }

    public render() {
        const { styles } = this.props;
        return (
            <View
                style={[styles.container, this.props.style]}
                onStartShouldSetResponderCapture={() => {
                    TextInputComponent.focus(this);
                    this.props.onFocus();
                    return true;
                }}
            >
                <Text numberOfLines={1} ellipsizeMode="head" style={styles.text}>
                    {this.props.word}
                </Text>
                <View style={[styles.cursor, { width: this.state.cursorWidth }]} />
            </View>
        );
    }
}

export const TextInput = smartConnect<IExternalProps>(TextInputComponent, [
    withTheme(stylesProvider)
]);
