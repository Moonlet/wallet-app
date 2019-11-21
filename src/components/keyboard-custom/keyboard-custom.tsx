import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { Icon } from '../icon';
import { digitsRow, firstRow, secondRow, thirdRow } from './words';

export interface IProps {
    showNumeric?: boolean;
    handleTextUpdate: (key: any) => void;
    handleDeleteKey: () => void;
}

interface IState {
    isCapsLock: boolean;
}

export class KeyboardComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            isCapsLock: false
        };
    }

    public renderRow = (rowValues: any, isDigitRow: boolean, isLastRow: boolean) => {
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
                    const key = this.state.isCapsLock && !isDigitRow ? word.upper : word.lower;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.keyContainer}
                            onPress={() => this.props.handleTextUpdate(key)}
                        >
                            <Text style={styles.keyText}>{key}</Text>
                        </TouchableOpacity>
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
                    {this.props.showNumeric && this.renderRow(digitsRow, true, false)}
                    {this.renderRow(firstRow, false, false)}
                    {this.renderRow(secondRow, false, false)}
                    {this.renderRow(thirdRow, false, true)}

                    <TouchableOpacity style={styles.nextWordContainer}>
                        <Text style={styles.nextWordText}>Next Word</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export const KeyboardCustom = smartConnect<IProps>(KeyboardComponent, [withTheme(stylesProvider)]);
