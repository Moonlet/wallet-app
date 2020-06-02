import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { Icon } from '../icon/icon';
import { smartConnect } from '../../core/utils/smart-connect';
import { normalize } from '../../styles/dimensions';
import { IconValues } from '../icon/values';

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
            <Icon name={IconValues.SEARCH} size={normalize(14)} style={props.styles.searchIcon} />
            <TextInput
                style={props.styles.input}
                placeholderTextColor={props.theme.colors.textTertiary}
                placeholder={props.placeholderText}
                autoCapitalize={'none'}
                autoCorrect={false}
                selectionColor={props.theme.colors.accent}
                value={fieldInput}
                onChangeText={value => {
                    props.onChangeText(value);
                    setFieldInput(value);
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
                    <Icon
                        name={IconValues.CLOSE}
                        size={normalize(16)}
                        style={props.styles.closeIcon}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export const SearchInput = smartConnect<IExternalProps>(SearchInputComponent, [
    withTheme(stylesProvider)
]);
