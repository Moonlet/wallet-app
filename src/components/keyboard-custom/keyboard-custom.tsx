import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { Icon } from '../icon';
import { CustomKey } from './custom-key';

const keyboardLayout = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export interface IProps {
    showNumeric?: boolean;
    handleTextUpdate: (key: any) => void;
    handleDeleteKey: () => void;
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

    public renderRow = (rowValues: any, isLastRow: boolean) => {
        const styles = this.props.styles;

        return (
            <View style={styles.rowContainer}>
                {/* CAPS LOCK */}
                {isLastRow ? (
                    <TouchableOpacity
                        style={styles.upperIcon}
                        onPress={() => this.setState({ isCapsLock: !this.state.isCapsLock })}
                    >
                        <Icon name="saturn-icon" size={25} style={styles.icon} />
                    </TouchableOpacity>
                ) : null}

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

                {/* DELETE */}
                {isLastRow ? (
                    <TouchableOpacity
                        style={styles.deleteIcon}
                        onPress={this.props.handleDeleteKey}
                    >
                        <Icon name="delete-1" size={25} style={styles.icon} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <View style={styles.headerButtonContainer}>
                    <TouchableOpacity style={[styles.headerButton, { marginRight: 1 }]}>
                        <Text style={styles.pasteWordText}>Paste</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.headerButton, { marginLeft: 1 }]}>
                        <Text style={styles.confirmWordText}>Confirm</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.keyboardLayout}>
                    {this.props.showNumeric && this.renderRow(keyboardLayout[0], false)}
                    {this.renderRow(keyboardLayout[1], false)}
                    {this.renderRow(keyboardLayout[2], false)}
                    {this.renderRow(keyboardLayout[3], true)}

                    <TouchableOpacity style={styles.nextWordContainer}>
                        <Text style={styles.nextWordText}>Next Word</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export const KeyboardCustom = smartConnect<IProps>(KeyboardComponent, [withTheme(stylesProvider)]);
