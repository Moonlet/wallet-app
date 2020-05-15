import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { Icon } from '../../components/icon';
import { smartConnect } from '../../core/utils/smart-connect';
import { normalize } from '../../styles/dimensions';

export interface IExternalProps {
    placeholderText: string;
    onChangeText: (text: string) => void;
    onClose: () => void;
}

export const SearchInputComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [fieldInput, setFieldInput] = React.useState<string>('');
    return (
        <View style={props.styles.inputBox}>
            <Icon name="search" size={normalize(14)} style={props.styles.searchIcon} />
            <TextInput
                style={props.styles.input}
                placeholderTextColor={props.theme.colors.textTertiary}
                placeholder={props.placeholderText}
                autoCapitalize={'none'}
                autoCorrect={false}
                selectionColor={props.theme.colors.accent}
                value={fieldInput}
                onChangeText={value => {
                    setFieldInput(value);
                    props.onChangeText(value);
                }}
            />
            {fieldInput !== '' && fieldInput !== undefined && (
                <TouchableOpacity
                    style={props.styles.closeIconContainer}
                    onPress={() => {
                        setFieldInput('');
                        props.onClose();
                    }}
                >
                    <Icon name="close" size={normalize(16)} style={props.styles.closeIcon} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export const SearchInput = smartConnect<IExternalProps>(SearchInputComponent, [
    withTheme(stylesProvider)
]);
