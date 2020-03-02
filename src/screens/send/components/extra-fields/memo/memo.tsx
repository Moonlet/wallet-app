import React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '../../../../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../../core/theme/with-theme';
import { translate } from '../../../../../core/i18n';

export interface IExternalProps {
    onMemoInput: (memo: string) => any;
}
interface IState {
    inputMemo: string;
}
export class MemoComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            inputMemo: ''
        };
    }
    public addMemo(value: string) {
        this.setState({
            inputMemo: value
        });
        this.props.onMemoInput(value);
    }

    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;

        return (
            <View style={styles.container}>
                <Text key={'memo-label'} style={styles.label}>
                    {translate('Send.memo')}
                </Text>

                <View style={[styles.inputBox, styles.inputBoxTop]}>
                    <TextInput
                        testID="memo"
                        style={styles.input}
                        placeholderTextColor={theme.colors.textSecondary}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.inputMemo}
                        onChangeText={value => this.addMemo(value)}
                    />
                </View>
            </View>
        );
    }
}

export const Memo = withTheme(stylesProvider)(MemoComponent);
