import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { Icon } from '../icon/icon';
import { CustomKey } from './custom-key';
import { ICON_SIZE, normalize } from '../../styles/dimensions';
import { IconValues } from '../icon/values';

const keyboardLayout = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export interface IKeyboardButton {
    label: string;
    onPress?: () => void;
    style?: {};
    disabled?: boolean;
    onPressIn?: () => void;
    onPressOut?: () => void;
}

export interface IProps {
    showNumeric?: boolean;
    handleTextUpdate: (key: any) => void;
    handleDeleteKey: () => void;
    buttons?: IKeyboardButton[];
    footerButton?: { label?: string; onPress: () => void; style?: {} };
    disableSpace?: boolean;
}

interface IState {
    isCapsLock: boolean;
    pressed: boolean;
}

export class KeyboardComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public panResponder = null;
    public ref = null;
    public viewRef = null;

    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            isCapsLock: false,
            pressed: false
        };
    }

    public renderRow = (rowValues: any, isLastRow?: boolean) => {
        const styles = this.props.styles;

        return (
            <View style={styles.rowContainer}>
                {isLastRow && (
                    <TouchableOpacity
                        style={styles.upperIconContainer}
                        onPress={() => this.setState({ isCapsLock: !this.state.isCapsLock })}
                    >
                        <Icon
                            name={IconValues.KEYBOARD_SHIFT}
                            size={normalize(16)}
                            style={styles.upperIcon}
                        />
                    </TouchableOpacity>
                )}

                {rowValues.map((word: any, index: any) => {
                    const currentWord =
                        typeof word === 'string'
                            ? this.state.isCapsLock
                                ? word.toUpperCase()
                                : word.toLowerCase()
                            : word;

                    return (
                        <CustomKey
                            key={index}
                            currentWord={currentWord}
                            addKey={() => this.props.handleTextUpdate(currentWord)}
                        />
                    );
                })}

                {isLastRow && (
                    <TouchableOpacity
                        style={styles.deleteIconContainer}
                        onPress={this.props.handleDeleteKey}
                    >
                        <Icon
                            name={IconValues.KEYBOARD_DELETE}
                            size={ICON_SIZE}
                            style={styles.deleteIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    public renderButtons = () => {
        const styles = this.props.styles;

        return this.props.buttons?.map((button: IKeyboardButton, index: any) => (
            <TouchableOpacity
                key={index}
                onPress={button.onPress}
                onPressIn={button?.onPressIn}
                onPressOut={button?.onPressOut}
                disabled={button?.disabled}
                style={[
                    styles.headerButton,
                    {
                        borderColor: button?.disabled
                            ? this.props.theme.colors.textTertiary
                            : this.props.theme.colors.accentSecondary
                    }
                ]}
            >
                <Text
                    style={[
                        styles.textButton,
                        button?.style,
                        {
                            color: button?.disabled
                                ? this.props.theme.colors.textSecondary
                                : this.props.theme.colors.accent
                        }
                    ]}
                >
                    {button.label}
                </Text>
            </TouchableOpacity>
        ));
    };

    public render() {
        const styles = this.props.styles;
        const footerButton = this.props.footerButton && this.props.footerButton;

        return (
            <View style={styles.container}>
                <View style={styles.headerButtonContainer}>{this.renderButtons()}</View>

                <View style={styles.keyboardLayout}>
                    {this.props.showNumeric && this.renderRow(keyboardLayout[0])}
                    {this.renderRow(keyboardLayout[1])}
                    {this.renderRow(keyboardLayout[2])}
                    {this.renderRow(keyboardLayout[3], true)}

                    {!this.props.disableSpace && (
                        <TouchableOpacity
                            onPress={footerButton?.onPress}
                            style={[styles.footerContainer]}
                        >
                            <Text style={[styles.footerText, footerButton?.style]}>
                                {footerButton?.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
}

export const KeyboardCustom = smartConnect<IProps>(KeyboardComponent, [withTheme(stylesProvider)]);
